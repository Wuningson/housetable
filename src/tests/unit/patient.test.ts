import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types, connect } from 'mongoose';
import patientModel from '../../models/patient.model';
import {
  deletePatientById,
  fetchPatientById,
  fetchPatients,
  updatePatientById
} from '../../services/patient.service';
import { generatePatient } from '../testData';

describe('Patient Service', () => {
  let mongod: MongoMemoryServer;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connect(mongod.getUri(), { dbName: 'test' });
  });

  afterEach(async () => {
    await patientModel.deleteMany({});
  });

  afterAll(async () => {
    await mongod.stop();
  });

  describe('createPatient', () => {
    it('should create a patient if the data is complete', async () => {
      const patient = generatePatient();
      const resp = await patientModel.create(patient);
      expect(resp.toObject()).toEqual(expect.objectContaining(patient));
    });

    it('should throw an error if the patient data is incomplete', async () => {
      const patient = {
        name: 'Bingo'
      };
      try {
        const resp = await patientModel.create(patient);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe('fetchPatients', () => {
    it('should fetch all patients in the database', async () => {
      const patient1 = generatePatient();
      const patient2 = generatePatient();

      await patientModel.create([patient1, patient2]);
      const resp = await fetchPatients();
      expect(resp).toEqual(
        expect.arrayContaining([
          expect.objectContaining(patient1),
          expect.objectContaining(patient2)
        ])
      );
    });
  });

  describe('updatePatientById', () => {
    it('should update the patient if a valid patient id is passed', async () => {
      const patient = await patientModel.create(generatePatient());
      const resp = await updatePatientById(patient._id, { name: 'Test' });
      expect(resp.toObject()).toEqual(
        expect.objectContaining({ ...patient.toObject(), name: 'Test' })
      );
    });

    it('should throw invalid patient id if an invalid patient id is passed', async () => {
      try {
        const resp = await updatePatientById(new Types.ObjectId().toString(), {
          name: 'Test'
        });
      } catch (err: any) {
        expect(err.message).toBe('invalid patient id');
      }
    });
  });

  describe('fetchPatientById', () => {
    it('should return the patient data if the id is valid', async () => {
      const patient = await patientModel.create(generatePatient());
      const resp = await fetchPatientById(patient._id);
      expect(resp?.toObject()).toStrictEqual(patient.toObject());
    });

    it('should throw invalid patient id if the data does not exist', async () => {
      try {
        const resp = await fetchPatientById(new Types.ObjectId().toString());
      } catch (err: any) {
        expect(err.message).toBe('invalid patient id');
      }
    });
  });

  describe('deletePatientById', () => {
    it('should delete a patient data', async () => {
      const patient = await patientModel.create(generatePatient());
      await deletePatientById(patient._id);
      const resp = await fetchPatients();
      expect(resp).toStrictEqual([]);
    });
  });
});
