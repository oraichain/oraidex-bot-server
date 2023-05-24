const schemaProperties = {
  CANCEL_PERCENTAGE: {
    type: 'string',
    title: 'Cancel percentage',
    default: '1'
  },
  BUY_PERCENTAGE: {
    type: 'string',
    title: 'Buy percentage',
    default: '0.55'
  },
  ORDER_INTERVAL_RANGE: {
    type: 'string',
    title: 'Order interval range',
    default: '50, 100'
  },
  SPREAD_RANGE: {
    type: 'string',
    title: 'Spread range for slippage',
    default: '0.003, 0.006'
  },
  VOLUME_RANGE: {
    type: 'string',
    title: 'Volume Range',
    default: '100000, 150000'
  },
  ORAI_THRESHOLD: {
    type: 'string',
    title: 'Orai token threshold',
    default: '10000000'
  },
  USDT_THRESHOLD: {
    type: 'string',
    title: 'Usdt token threshold',
    default: '10000000'
  },
  ORDERBOOK_CONTRACT: {
    type: 'string',
    title: 'Orderbook contract address',
    minLength: 40
  },
  USDT_CONTRACT: {
    type: 'string',
    title: 'Usdt contract address',
    minLength: 40
  }
};

export type SchemaProperty = keyof typeof schemaProperties;

export type FormData = Record<SchemaProperty, string>;

const formData = Object.fromEntries(
  ['CANCEL_PERCENTAGE', 'BUY_PERCENTAGE', 'ORDER_INTERVAL_RANGE', 'SPREAD_RANGE', 'VOLUME_RANGE', 'ORAI_THRESHOLD', 'USDT_THRESHOLD', 'ORDERBOOK_CONTRACT', 'USDT_CONTRACT'].map((k) => [k, process.env[k]])
) as FormData;

export default {
  schema: {
    title: 'Market Maker Bot Configuration',
    description: 'A simple market maker bot.',
    type: 'object',
    required: ['ORDERBOOK_CONTRACT', 'USDT_CONTRACT'],
    properties: schemaProperties
  },

  uiSchema: {
    CANCEL_PERCENTAGE: {
      'ui:lange': 'en'
    },
    ORDER_INTERVAL_RANGE: {
      'ui:placeholder': '50, 100'
    },
    SPREAD_RANGE: {
      'ui:placeholder': '0.003, 0.006'
    },
    VOLUME_RANGE: {
      'ui:placeholder': '100000, 150000'
    }
  },

  formData
};
