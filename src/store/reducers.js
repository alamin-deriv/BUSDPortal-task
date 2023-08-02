export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    case "ETHER_BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };

    default:
      return state;
  }
};

const DEFAULT_TOKENS_STATE = {
  loaded: false,
  contracts: null,
  BUSDHandlerContracts: null,
  symbols: "",
  totalSupply: "",
  transaction: {
    isSuccessful: false,
  },
  balance: ""
};

export const tokens = (state = DEFAULT_TOKENS_STATE, action) => {

  switch (action.type) {
    case "TOKEN_LOADED":
      return {
        ...state,
        loaded: true,
        contracts: action.token,
        symbols: action.symbol,
      };
    case "BUSDHANDLER_LOADED":
      return {
        ...state,
        loaded: true,
        BUSDHandlerContracts: action.BUSDHandler,
        totalSupply: action.totalSupply,
      };
    case "TOKEN_BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };

    case "REQUEST":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: true,
          isSuccessful: false,
        },
        transferInProgress: true,
        
      };
    case "SUCCESS":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: true,
        },
        transferInProgress: false,
        totalSupply: action.balance,
      };
    case "FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
        transferInProgress: false,
      };

    default:
      return state;
  }
};



