import mongoose from 'mongoose';

export default async function () {
  const url = 'mongodb://localhost:27017/housetable';
  try {
    console.log('Connecting to database');

    await mongoose.connect(url);

    console.log(`Connected to database`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
