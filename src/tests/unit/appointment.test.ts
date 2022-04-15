import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types, connect } from 'mongoose';
import patientModel from '../../models/patient.model';
import appointmentModel from '../../models/appointment.model';
import {
  createPatient,
  deletePatientById,
  fetchPatients,
  updatePatientById
} from '../../services/patient.service';
import { generateAppointment, generatePatient } from '../testData';
import {
  addAppointment,
  deleteAppointmentById,
  fetchPatientsAppointments,
  generateReports,
  getAppointmentsForDay,
  getPopularPet,
  remainingBillForPatient,
  totalByPet,
  unpaidAppointments,
  updateAppointmentById
} from '../../services/appointment.service';
import { eurRate } from '../../utils';

describe('Appointment Service', () => {
  let mongod: MongoMemoryServer;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connect(mongod.getUri(), { dbName: 'test' });
  });

  afterEach(async () => {
    await patientModel.deleteMany({});
    await appointmentModel.deleteMany({});
  });

  afterAll(async () => {
    await mongod.stop();
  });

  describe('addAppointment', () => {
    it('should return an appointment if the data is valid', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment = generateAppointment(patient._id, startTime, endTime);
      const resp = await addAppointment(appointment);
      expect(resp.toObject()).toEqual(
        expect.objectContaining({
          ...appointment,
          startTime: new Date(startTime),
          endTime: new Date(endTime)
        })
      );
    });

    it('should throw an error if the pateient id is invalid', async () => {
      try {
        const startTime = '2022-04-11 8:10';
        const endTime = '2022-04-11 8:40';
        const appointment = generateAppointment(
          new Types.ObjectId().toString(),
          startTime,
          endTime
        );
        const resp = await addAppointment(appointment);
      } catch (err: any) {
        console.log(err);
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe('fetchPatientsAppointments', () => {
    it('should return an array of patient appointment', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment = await addAppointment(
        generateAppointment(patient._id, startTime, endTime)
      );
      const resp = await fetchPatientsAppointments(patient._id);
      expect(resp).toEqual(
        expect.arrayContaining([
          expect.objectContaining(appointment.toObject())
        ])
      );
    });
  });

  describe('updateAppointmentById', () => {
    it('should update patient appointment if the valid id is passed', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment = await addAppointment(
        generateAppointment(patient._id, startTime, endTime)
      );

      const resp = await updateAppointmentById(appointment._id, {
        description: 'nice one'
      });
      expect(resp.toObject()).toEqual(
        expect.objectContaining({
          ...appointment.toObject(),
          description: 'nice one'
        })
      );
    });

    it('should throw an error if the id is not valid', async () => {
      try {
        await updateAppointmentById(new Types.ObjectId().toString(), {
          description: 'nice one'
        });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe('deleteAppointmentById', () => {
    it('should not have any day in appointment model after deleting', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment = await addAppointment(
        generateAppointment(patient._id, startTime, endTime)
      );

      await deleteAppointmentById(appointment._id);

      const resp = await appointmentModel.find({});
      expect(resp).toStrictEqual([]);
    });
  });

  describe('getAppointementsForDay', () => {
    it('should return the appointments for the day', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment = await addAppointment(
        generateAppointment(patient._id, startTime, endTime)
      );

      const resp = await getAppointmentsForDay('2022-04-11');
      expect(resp).toEqual(
        expect.arrayContaining([
          expect.objectContaining(appointment.toObject())
        ])
      );
    });
  });

  describe('unpaidAppointments', () => {
    it('should return the unpaid appointments', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment = await addAppointment(
        generateAppointment(patient._id, startTime, endTime, 'UNPAID')
      );

      const resp = await unpaidAppointments();

      expect(resp).toEqual(
        expect.arrayContaining([
          expect.objectContaining(appointment.toObject())
        ])
      );
    });
  });

  describe('remainingBillForPatient', () => {
    it('should return the total of unpaid appointments for a patient', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment1 = await addAppointment(
        generateAppointment(patient._id, startTime, endTime, 'UNPAID')
      );
      const appointment2 = await addAppointment(
        generateAppointment(
          patient._id,
          '2022-04-9 8:10',
          '2022-04-9 8:25',
          'UNPAID'
        )
      );

      const resp = await remainingBillForPatient(patient._id);
      expect(resp).toBe(appointment1.amount + appointment2.amount);
    });
  });

  describe('gnerateReports', () => {
    it('should return the total paid appointments that week', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment1 = await addAppointment(
        generateAppointment(patient._id, startTime, endTime, 'EUR')
      );
      const appointment2 = await addAppointment(
        generateAppointment(
          patient._id,
          '2022-04-13 8:10',
          '2022-04-13 8:25',
          'USD'
        )
      );

      const resp = await generateReports('week', 'paid');
      expect(resp).toBe(appointment2.amount + appointment1.amount * eurRate);
    });

    it('should return the total unpaid appointments that month', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment1 = await addAppointment(
        generateAppointment(patient._id, startTime, endTime, 'UNPAID')
      );
      const appointment2 = await addAppointment(
        generateAppointment(
          patient._id,
          '2022-04-13 8:10',
          '2022-04-13 8:25',
          'UNPAID'
        )
      );

      const resp = await generateReports('month', 'unpaid');
      expect(resp).toBe(appointment1.amount + appointment2.amount);
    });
  });

  describe('getPopularPet', () => {
    it('should return the popular pet', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment1 = await addAppointment(
        generateAppointment(patient._id, startTime, endTime, 'UNPAID')
      );
      const appointment2 = await addAppointment(
        generateAppointment(
          patient._id,
          '2022-04-13 8:10',
          '2022-04-13 8:25',
          'UNPAID'
        )
      );

      const resp = await getPopularPet();
      expect(resp).toBe('bird');
    });
  });

  describe('totalByPet', () => {
    it('should the total amount generated by pet', async () => {
      const patient = await createPatient(generatePatient());
      const startTime = '2022-04-11 8:10';
      const endTime = '2022-04-11 8:40';
      const appointment1 = await addAppointment(
        generateAppointment(patient._id, startTime, endTime, 'UNPAID')
      );
      const appointment2 = await addAppointment(
        generateAppointment(
          patient._id,
          '2022-04-13 8:10',
          '2022-04-13 8:25',
          'UNPAID'
        )
      );

      const resp = await totalByPet('bird');
      expect(resp).toBe(appointment1.amount + appointment2.amount);
    });
  });
});
