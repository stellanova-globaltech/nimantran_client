const SampleGuestList = [
  { name: "pawan mishra", mobileNumber: "919855556173" },
  {
    name: "Dr. Venkatanarasimha Raghavan Srinivasachariyar Iyer",
    mobileNumber: "918555759764",
  },
  {
    name: "Raj",
    mobileNumber: "917555776587",
  },
  {
    name: "Kushagra Nalwaya",
    mobileNumber: "918555977161",
  },
  {
    name: "HARSHIL PAGARIA",
    mobileNumber: "919255557211",
  },
];

const transitionArray = [
  {
    type: "none",
    name: "Select Transition",
    options: null,
  },
  {
    type: "move_up",
    name: "Move Up",
    options: {
      top: 50,
      duration: 1,
    },
  },
  {
    type: "move_down",
    name: "Move Down",
    options: {
      bottom: 100,
      duration: 1,
    },
  },
  {
    type: "move_right",
    name: "Move Right",
    options: {
      right: 50,
      duration: 1,
    },
  },
  {
    type: "move_left",
    name: "Move Left",
    options: {
      left: 50,
      duration: 1,
    },
  },
  {
    type: "path_cover",
    name: "Rotate",
    options: {
      rotationSpeed: 0.4,
      duration: 1,
      clockwise: false,
    },
  },
  {
    type: "fade",
    name: "Fade",
    options: {
      duration: 1,
    },
  },
  {
    type: "zoom_in",
    name: "Zoom In",
    options: {
      duration: 1,
    },
  },
  {
    type: "zoom_out",
    name: "Zoom Out",
    options: {
      duration: 1,
    },
  },
];

export { SampleGuestList, transitionArray };
