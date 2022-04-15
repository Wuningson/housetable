import CustomError from '../config/error';
import patientModel from '../models/patient.model';

export async function createPatient(body: Patient) {
  const patient = await patientModel.create(body);
  if (!patient) {
    throw new CustomError('BAD_REQUEST', 'could not create patient');
  }

  return patient;
}

export async function fetchPatients() {
  return await patientModel.find({});
}

export async function updatePatientById(id: string, body: Partial<Patient>) {
  const patient = await patientModel.findByIdAndUpdate(id, body, { new: true });

  if (!patient) {
    throw new CustomError('BAD_REQUEST', 'invalid patient id');
  }

  return patient;
}

export async function fetchPatientById(id: string) {
  const patient = await patientModel.findById(id);
  if (!patient) {
    new CustomError('BAD_REQUEST', 'invalid patient id');
  }

  return patient;
}

export async function deletePatientById(id: string) {
  await patientModel.findByIdAndDelete(id);
}
