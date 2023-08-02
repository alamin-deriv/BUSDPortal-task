import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { transferTokens } from "../store/interactions";

const Transfer = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const provider = useSelector((state) => state.provider.connection);
  const tokens = useSelector((state) => state.tokens.contracts);
  const BUSDHandler = useSelector((state) => state.tokens.BUSDHandlerContracts);

  const dispatch = useDispatch();

  const handleTransfer = (e) => {
    e.preventDefault();
    transferTokens(provider, tokens, BUSDHandler, address, amount, dispatch);
  };

  return (
    <div className="component exchange__orders">
      <div className="component__header flex-between">
        <div/>
        <div className="tabs">
          <button className="tab tab--active">Transfer Tokens</button>
        </div>
      </div>

      <form onSubmit={handleTransfer}>
        <label htmlFor="amount">Enter Address</label>

        <input
          type="text"
          id="address"
          placeholder="0x0"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label htmlFor="amount">Enter Amount</label>

        <input
          type="text"
          id="amount"
          placeholder="0.0000"
          value={amount === 0 ? "" : amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="button button--filled" type="submit">
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

export default Transfer;
