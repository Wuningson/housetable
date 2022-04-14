import { Router } from 'express';
import {
  addNewPatient,
  deletePatientDetails,
  fetchListOfAllPatients,
  updatePatientDetails
} from '../controllers/patient.controller';

const router = Router();

router.post('/patients', addNewPatient);
router.get('/patients', fetchListOfAllPatients);
router.put('/patients/:id', updatePatientDetails);
router.delete('/patients/:id', deletePatientDetails);

export default router;
