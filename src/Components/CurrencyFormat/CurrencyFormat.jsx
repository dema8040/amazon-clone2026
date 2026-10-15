import React from "react";
import numeral from "numeral";

const CurrencyFormat = ({ amount }) => {
  const numericAmount = Number(amount);

  const formattedAmount = Number.isFinite(numericAmount)
    ? numeral(numericAmount).format("$0,0.00")
    : "$0.00";

  return <div>{formattedAmount}</div>;
};

export default CurrencyFormat;
