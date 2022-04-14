import { RequestHandler } from 'express';
import CustomError, { handleError } from '../config/error';
import { SuccessResponse } from '../config/response';
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
} from '../services/appointment.service';

export const addAppointmentToPatient: RequestHandler<
  {},
  {},
  Appointment
> = async (req, res) => {
  try {
    const appointment = await addAppointment(req.body);

    return SuccessResponse(
      res,
      'appointment added to patient',
      appointment,
      201
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const fetchListOfAppointmentsForAPatient: RequestHandler<{
  patientId: string;
}> = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await fetchPatientsAppointments(patientId);

    return SuccessResponse(
      res,
      'list of appointments fetched for patient',
      appointments
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const updateAppointmentDetails: RequestHandler<
  { id: string },
  {},
  Partial<Appointment>
> = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await updateAppointmentById(id, req.body);

    return SuccessResponse(
      res,
      'appointment details updated successfully',
      appointment
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const deleteAppointmentDetails: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await deleteAppointmentById(id);

    return SuccessResponse(
      res,
      'appointment details deleted successfully',
      null
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const fetchAppointmentsForADay: RequestHandler<
  {},
  {},
  {},
  { day?: string }
> = async (req, res) => {
  try {
    const { day } = req.query;
    if (!day) {
      throw new CustomError('BAD_REQUEST', 'day is required');
    }

    const appointments = await getAppointmentsForDay(day);

    return SuccessResponse(
      res,
      'appointments fetched successfully',
      appointments
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const fetchUnpaidAppointments: RequestHandler = async (req, res) => {
  try {
    const appointments = await unpaidAppointments();

    return SuccessResponse(
      res,
      'unpaid appointments fetched successfully',
      appointments
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const fetchRemainingBillForPatient: RequestHandler<{
  patientId: string;
}> = async (req, res) => {
  try {
    const { patientId } = req.params;
    const bill = await remainingBillForPatient(patientId);
    return SuccessResponse(res, 'remaining bill fetched for patient', {
      amount: bill
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const amountPaidInAPeriod: RequestHandler<
  {},
  {},
  {},
  { period: ReportPeriod }
> = async (req, res) => {
  try {
    const { period } = req.query;
    const amount = await generateReports(period, 'paid');
    return SuccessResponse(
      res,
      `amount paid in ${period} fetched successfully`,
      { amount }
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const amountUnpaidInAPeriod: RequestHandler<
  {},
  {},
  {},
  { period: ReportPeriod }
> = async (req, res) => {
  try {
    const { period } = req.query;
    const amount = await generateReports(period, 'unpaid');

    return SuccessResponse(
      res,
      `amount unpaid in ${period} fetched successfully`,
      { amount }
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const balanceInAPeriod: RequestHandler<
  {},
  {},
  {},
  { period: ReportPeriod }
> = async (req, res) => {
  try {
    const { period } = req.query;
    const paid = await generateReports(period, 'paid');
    const unpaid = await generateReports(period, 'unpaid');

    return SuccessResponse(res, 'balance fetched successfully', {
      balance: paid - unpaid
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const mostPopularPet: RequestHandler = async (req, res) => {
  try {
    const popularPet = await getPopularPet();

    return SuccessResponse(
      res,
      'most popular pet fetched successfully',
      popularPet
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const fetchTotalByPet: RequestHandler<
  {},
  {},
  {},
  { pet: PatientType }
> = async (req, res) => {
  try {
    const { pet } = req.query;
    console.log({ pet });
    const total = await totalByPet(pet);

    return SuccessResponse(res, 'total by pet', total);
  } catch (err) {
    return handleError(err, res);
  }
};
