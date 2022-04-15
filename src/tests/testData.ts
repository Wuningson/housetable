import { faker } from '@faker-js/faker';

export const generatePatient = (): Patient => ({
  name: faker.animal.bird(),
  type: 'bird',
  ownerAddress: faker.address.streetAddress(),
  ownerPhoneNumber: faker.phone.phoneNumber(),
  ownerName: `${faker.name.firstName()} ${faker.name.lastName()}`
});

const random = (max: number) => Math.floor(Math.random() * max);

const paidBy: AppointmentPaidBy[] = ['USD', 'EUR', 'BTC', 'UNPAID'];

export const generateAppointment = (
  patientId: string,
  startTime: string,
  endTime: string,
  feePaidBy?: AppointmentPaidBy
): Appointment => ({
  patient: patientId,
  startTime: new Date(startTime),
  endTime: new Date(endTime),
  description: 'test description',
  feePaidBy: feePaidBy || paidBy[random(4)],
  amount: random(56)
});
