const environment = {
  development: {
    paypalClientId:
      "Ae0Pu7TO-KIMal3n-RZ0tp2ZCCTsntfFQu0T4W1xM3ZroRaVCVVpmk3SI51Eqkc92jMrYOAX9vnDajpZ",
  },
  production: {
    paypalClientId:
      "AZjfrbhbsFAycOCa1e8Fd1wRtTAgBs9Xf4m6hqJG-mRJs4_P8htSYogNhtpZy5njA0eKG8zAsyHvIVqJ",
  },
};

export default environment[process.env.NEXT_PUBLIC_ENVIRONMENT];
