export const PER_PAGE = 10;

const statechart = {
  initial: 'start',
  states: {
    start: {
      on: {
        READY: 'fetching',
      },
      onEntry: 'attach',
    },
    listening: {
      on: {
        SCROLL: {
          fetching: {
            cond: ({ scrollPercentage }) => scrollPercentage > 0.9,
          },
        },
      },
    },
    fetching: {
      on: {
        SUCCESS: {
          listening: {
            cond: ({ beers }) => beers.length % PER_PAGE === 0,
          },
          finish: {
            cond: ({ beers }) => beers.length % PER_PAGE > 0,
          },
        },
        ERROR: {
          listening: {
            actions: 'error',
          },
        },
      },
      onEntry: 'fetch',
    },
    finish: {
      onEntry: 'detach',
    },
  },
};

export default statechart;
