import { RequestHandler } from 'express';
import { handleError } from '../config/error';
import { SuccessResponse } from '../config/response';
import {
  createPatient,
  deletePatientById,
  fetchPatients,
  updatePatientById
} from '../services/patient.service';

export const addNewPatient: RequestHandler<{}, {}, Patient> = async (
  req,
  res
) => {
  try {
    const patient = await createPatient(req.body);

    return SuccessResponse(res, 'patient added successfully', patient, 201);
  } catch (err) {
    return handleError(err, res);
  }
};

export const fetchListOfAllPatients: RequestHandler = async (req, res) => {
  try {
    const patients = await fetchPatients();

    return SuccessResponse(res, 'patients fetched successfully', patients);
  } catch (err) {
    return handleError(err, res);
  }
};

export const updatePatientDetails: RequestHandler<
  { id: string },
  {},
  Partial<Patient>
> = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await updatePatientById(id, req.body);

    return SuccessResponse(
      res,
      'patient details updated successfully',
      patient
    );
  } catch (err) {
    return handleError(err, res);
  }
};

export const deletePatientDetails: RequestHandler<
  { id: string },
  {},
  {}
> = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePatientById(id);

    return SuccessResponse(res, 'patient details deleted successfully', null);
  } catch (err) {
    return handleError(err, res);
  }
};
