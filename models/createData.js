const User = require('./userModel');
const Business = require('./businessModel');

//Sample data creation for testing and not ment to use anywhere in alexis-website

async function createUserAndBusiness(userData, businessData) {
  try {
    // Create a new User document
    const user = await User.create(userData);

    // Add the user ID & name to the business data
    businessData.user = user._id;
    businessData.userName = user.firstName+' '+user.lastName;

    // Create a new Business document
    const business = await Business.create(businessData);

    // Update the user with the created business
    user.businesses.push(business._id);
    user.businessesName.push(business.businessName);
    await user.save();

    console.log('User and Business data created successfully!');
    console.log('User:', user);
    console.log('Business:', business);
  } catch (error) {
    console.error('Error creating User and Business:', error);
  }
}




module.exports=createUserAndBusiness;
