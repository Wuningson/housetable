import { Router } from 'express';
import {
  addAppointmentToPatient,
  amountPaidInAPeriod,
  amountUnpaidInAPeriod,
  balanceInAPeriod,
  deleteAppointmentDetails,
  fetchAppointmentsForADay,
  fetchListOfAppointmentsForAPatient,
  fetchRemainingBillForPatient,
  fetchTotalByPet,
  fetchUnpaidAppointments,
  mostPopularPet,
  updateAppointmentDetails
} from '../controllers/appointment.controller';

const router = Router();

router.post('/appointments', addAppointmentToPatient);
router.get('/appointments/day', fetchAppointmentsForADay);
router.get('/appointments/unpaid', fetchUnpaidAppointments);
router.get('/bill/paid', amountPaidInAPeriod);
router.get('/bill/unpaid', amountUnpaidInAPeriod);
router.get('/bill/balance', balanceInAPeriod);
router.get('/bill/:patientId', fetchRemainingBillForPatient);
router.get('/appointments/:patientId', fetchListOfAppointmentsForAPatient);
router.put('/appointments/:id', updateAppointmentDetails);
router.delete('/appointments/:id', deleteAppointmentDetails);
router.get('/pet/popular', mostPopularPet);
router.get('/pet/total', fetchTotalByPet);

export default router;
