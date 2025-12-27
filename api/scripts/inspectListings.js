import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';

dotenv.config({ path: '.env' });

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('connected to mongo');
    const listings = await Listing.find({}).limit(10).lean();
    console.log('found', listings.length, 'listings');
    listings.forEach((l, i) => {
      console.log('\n--- listing', i, l._id);
      console.log('imageUrls:', l.imageUrls);
      console.log('images:', l.images);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();