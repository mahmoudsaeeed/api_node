## link between two collections
ownerId: {
    type: mongoose.Schema.Types.ObjectId, // ID الخاص باليوزر
    ref: "User", // ربط مع موديل اليوزر
    required: true,
  },