const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    llcNo: {
      type: String,
    },

    businessType: {
      type: String,
      required: true,
    },

    businessIndustry: {
      type: String,
      // required: true
    },

    regState: {
      type: String,
      default: "New Jersey",
    },

    members: {
      type: Array,
      default: [],
    },
    physicalAddress: {
      type: String,
    },
    mailingAddress: {
      type: String,
    },
    principalAddress: {
      type: String,
    },
    officialAddress: {
      type: String,
    },
    authorizedSignature: {
      type: String,
    },

    //business related questions:

    businessExperience: {
      type: String,
      required: true,
    },
    businessLocation: {
      type: String,
      required: true,
    },

    totalEmployees: {
      type: String,
      required: true,
    },

    businessStatus: {
      type: String,
      required: true,
    },

    businessGoals: {
      type: String,
      required: true,
    },

    registeredAgent: {
      type: String,
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Packages",
      required: true,
    },
    otherOwner: {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      middlename: {
        type: String,
      },
      email: {
        type: String,
      },
      mobile: {
        type: String,
      },
    },

    //packages/products information :

    productsIncluded: [
      {
        productName: {
          type: Array,
        },
        orderDate: {
          type: Date,
          default: new Date(),
        },
        fullfillmentStatus: {
          type: String,
        },
        paymentStatus: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const businessModel = mongoose.model("Business", businessSchema);

module.exports = businessModel;
