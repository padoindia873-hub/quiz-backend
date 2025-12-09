import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },

  // user type
  userType: { 
    type: String, 
    enum: ["STUDENT", "ADMIN", "SUPER_ADMIN"], 
    default: "STUDENT",
    required: true 
  },

  /* Student Fields */
  dateOfBirth: String,
  whatsappNumber: String,
  address: String,
  district: String,
  state: String,
  pin: String,
  schoolName: String,
  studentClass: String,
  schoolAddress: String,
  aadharCardNumber: String,
  bankTransaction: String,
  section:String,
  schoolRoll: String,
  buyRoll: String,
  profileImage: String,
  startTime:String,
  endTime:String,
  rollActive:String,
  rollInactive:String,
  rank:String,
  academyMarks: String,
  gkMarks: String,
  fistLevel:String,
  secLevel:String,
  thirdLevel:String,
  winnerDetails: String,
  oneUserBuyRoll: String,
  oneUserWinner:String,
  bankTransactionStudent: String,
});

export default mongoose.model("User", userSchema);
