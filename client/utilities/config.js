const environment = {
  development: {
    stripePublishableKey:
      "pk_test_51OXSmaHxxGduf7hIKonxe3PWejAgpaJxp8xB23FJKpd382RWoPAmauml6l7hg7rIM5sYLm0Si6Y5PZdkON2Cgokj00ODR51asQ",
  },
  staging: {
    stripePublishableKey:
      "pk_test_51OXSmaHxxGduf7hIKonxe3PWejAgpaJxp8xB23FJKpd382RWoPAmauml6l7hg7rIM5sYLm0Si6Y5PZdkON2Cgokj00ODR51asQ",
  },
  production: {
    stripePublishableKey:
      "pk_live_51OXSmaHxxGduf7hI1BhoX0R1e6mQtCN5jxnM12bWXNE3tU5ZhnSh96PJD7ZrqCCH2vhThBwXh9nQvht5DDqk3FN700uhNoRdhY",
  },
};

export default environment[process.env.NEXT_PUBLIC_ENVIRONMENT];
