import CustomError from '../config/error';
import appointmentModel from '../models/appointment.model';
import { Types } from 'mongoose';
import dayjs from 'dayjs';
import { btcRate, eurRate } from '../utils';
import { fetchPatientById } from './patient.service';

export async function addAppointment(body: Appointment) {
  fetchPatientById(String(body.patient));

  const appointment = appointmentModel.create(body);
  if (!appointment) {
    throw new CustomError('BAD_REQUEST', 'could not create appointment');
  }

  return appointment;
}

export async function fetchPatientsAppointments(patientId: string) {
  return await appointmentModel.find({ patient: patientId });
}

export async function updateAppointmentById(
  id: string,
  body: Partial<Appointment>
) {
  const appointment = await appointmentModel.findByIdAndUpdate(id, body, {
    new: true
  });

  if (!appointment) {
    throw new CustomError('BAD_REQUEST', 'invalid appointment id');
  }

  return appointment;
}

export async function deleteAppointmentById(id: string) {
  await appointmentModel.findByIdAndDelete(id);
}

export async function getAppointmentsForDay(day: string) {
  const startOfDay = dayjs(day).startOf('day').toDate();
  const endOfDay = dayjs(day).endOf('day').toDate();

  return await appointmentModel.find({
    startTime: { $gte: startOfDay, $lte: endOfDay }
  });
}

export async function unpaidAppointments() {
  return await appointmentModel.find({ feePaidBy: 'UNPAID' });
}

export async function remainingBillForPatient(patientId: string) {
  const aggregation = [
    {
      $match: {
        feePaidBy: 'UNPAID',
        patient: new Types.ObjectId(patientId)
      }
    },
    {
      $group: {
        _id: null,
        sum: { $sum: '$amount' }
      }
    }
  ];

  const result = await appointmentModel.aggregate(aggregation);
  console.log(result);
  if (result[0]?.sum) {
    return result[0].sum;
  }
  return 0;
}

export async function generateReports(period: ReportPeriod, type: ReportType) {
  const start = dayjs().startOf(period).toDate();
  const end = dayjs().endOf(period).toDate();

  const feePaidBy = type === 'paid' ? { $ne: 'UNPAID' } : 'UNPAID';

  const aggregation = [
    {
      $match: {
        startTime: {
          $gte: start,
          $lte: end
        },
        feePaidBy
      }
    },
    {
      $project: {
        total: {
          $let: {
            vars: {
              rate: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$feePaidBy', 'EUR'] },
                      then: eurRate
                    },
                    {
                      case: { $eq: ['$feePaidBy', 'BTC'] },
                      then: btcRate
                    }
                  ],
                  default: 1
                }
              }
            },
            in: { $multiply: ['$amount', '$$rate'] }
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        finalTotal: { $sum: '$total' }
      }
    }
  ];

  const result = await appointmentModel.aggregate(aggregation);
  if (result[0]?.finalTotal >= 0) {
    return result[0].finalTotal;
  }
  new CustomError('BAD_REQUEST', 'could not get reports');
}

export async function getPopularPet() {
  const result = await appointmentModel.aggregate([
    {
      $lookup: {
        from: 'patients',
        as: 'patient',
        foreignField: '_id',
        localField: 'patient'
      }
    },
    {
      $unwind: '$patient'
    },
    {
      $group: {
        _id: '$patient.type',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    { $limit: 1 }
  ]);

  if (result[0]?._id) {
    return result[0]?._id;
  }
  throw new CustomError('BAD_REQUEST', 'could not fetch popular pet');
}

export async function totalByPet(pet: PatientType) {
  const aggregation = [
    {
      $lookup: {
        from: 'patients',
        as: 'patient',
        foreignField: '_id',
        localField: 'patient'
      }
    },
    {
      $addFields: {
        patient: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$patient',
                as: 'pet',
                cond: {
                  $eq: ['$$pet.type', pet]
                }
              }
            },
            0
          ]
        }
      }
    },
    {
      $project: {
        total: {
          $let: {
            vars: {
              rate: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $and: [
                          { $eq: ['$feePaidBy', 'EUR'] },
                          { $gt: ['$patient', null] }
                        ]
                      },
                      then: eurRate
                    },
                    {
                      case: {
                        $and: [
                          { $eq: ['$feePaidBy', 'BTC'] },
                          { $gt: ['$patient', null] }
                        ]
                      },
                      then: btcRate
                    },
                    {
                      case: {
                        $and: [
                          { $eq: ['$feePaidBy', 'USD'] },
                          { $gt: ['$patient', null] }
                        ]
                      },
                      then: 1
                    },
                    {
                      case: {
                        $and: [
                          { $eq: ['$feePaidBy', 'UNPAID'] },
                          { $gt: ['$patient', null] }
                        ]
                      },
                      then: 1
                    }
                  ],
                  default: 0
                }
              }
            },
            in: { $multiply: ['$amount', '$$rate'] }
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        finalTotal: { $sum: '$total' }
      }
    }
  ];

  const result = await appointmentModel.aggregate(aggregation);
  if (result[0]?.finalTotal >= 0) {
    return result[0].finalTotal;
  }

  throw new CustomError('BAD_REQUEST', `could not fetch total for ${pet}`);
}
