import axios from "axios";
import { React, useContext, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { BsPassFill } from "react-icons/bs";
import { useState } from "react";

import ResultModal from "./ResultModal.js";

import { TestContext } from "../../contexts/TestContext";

function ContentDashboard(props) {
  // const [typeCashOut, setTypeCashOut] = useState(true);
  // const [typeTransfer, setTypeTransfer] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  // const [modalData, setModalData] = useState("default");
  // const [datajson, setDataJson] = useState({});

  const queriesUpdate = props.queriesUpdate;
  const setQueriesUpdate = props.setQueriesUpdate;

  var datajson = useRef({});

  var resultData = useRef("default");

  var modalData = useRef("default");

  var typeCashOut = useRef(true);
  var typeTransfer = useRef(false);

  var oldBalanceOrig = useRef(0);
  var newBalanceOrig = useRef(0);
  var oldBalanceDest = useRef(0);
  var newBalanceDest = useRef(0);
  var transactionAmount = useRef(0);
  var TransactionTime = useRef(1);

  // const resetFields = () => {
  //   datajson.current = {};

  //   resultData.current = "default";

  //   modalData.current = "default";

  //   typeCashOut.current = true;
  //   typeTransfer.current = false;

  //   oldBalanceOrig.current = 0;
  //   newBalanceOrig.current = 0;
  //   oldBalanceDest.current = 0;
  //   newBalanceDest.current = 0;
  //   transactionAmount.current = 0;
  //   TransactionTime.current = 1;

  //   typeCashOut.current = true;
  //   typeTransfer.current = false;
  //   console.log("reset, amount > ", transactionAmount.current);
  // };
  // resetFields();

  // var datajson = {};

  const { user, setUser } = useContext(TestContext);

  const clearForm = () => {
    var formData = document.getElementById("mainForm");
    formData.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    datajson.current = {
      user_id: user._id,
      amount: transactionAmount.current,
      oldbalanceOrg: oldBalanceOrig.current,
      newbalanceOrg: newBalanceOrig.current,
      origBalance_inacc:
        oldBalanceOrig.current -
        transactionAmount.current -
        newBalanceOrig.current,
      oldbalanceDest: oldBalanceDest.current,
      newbalanceDest: newBalanceDest.current,
      destBalance_inacc:
        oldBalanceDest.current +
        transactionAmount.current -
        newBalanceDest.current,
      type_CASH_OUT: typeCashOut.current,
      type_TRANSFER: typeTransfer.current,
      step: TransactionTime.current,
    };

    // setDataJson({
    //   user_id: user._id,
    //   amount: transactionAmount,
    //   oldbalanceOrg: oldBalanceOrig,
    //   newbalanceOrg: newBalanceOrig,
    //   origBalance_inacc: oldBalanceOrig - transactionAmount - newBalanceOrig,
    //   oldbalanceDest: oldBalanceDest,
    //   newbalanceDest: newBalanceDest,
    //   destBalance_inacc: oldBalanceDest + transactionAmount - newBalanceDest,
    //   type_CASH_OUT: typeCashOut,
    //   type_TRANSFER: typeTransfer,
    //   step: TransactionTime,
    //   alias: transactionAlias,
    // });
    const ml_datajson_array = [
      TransactionTime.current,
      transactionAmount.current,
      oldBalanceOrig.current,
      oldBalanceDest.current,
      oldBalanceOrig.current -
        transactionAmount.current -
        newBalanceOrig.current,
      oldBalanceDest.current +
        transactionAmount.current -
        newBalanceDest.current,
      typeCashOut.current,
      typeTransfer.current,
    ];

    // console.log("datajson collection, ", datajson);
    // console.log("ml query data collection, ", ml_datajson_array); // console.log(datajson);
    const POST_ml_query = async (record) => {
      const data = [record];
      // console.log("ml query data in POST", data);
      const res = await fetch("http://localhost:5000/ml_query", {
        method: "POST",
        body: JSON.stringify({ data: data }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          modalData.current = res[0];
          // console.log("modalData ,", res[0]);
          setShowResultModal(true);
        });
    };

    POST_ml_query(ml_datajson_array);

    // resetFields();
    // console.log(queries);
    setQueriesUpdate(!queriesUpdate);

    clearForm();
  };

  // (e) =>{(e)=>{if(e.currentTarget.value= 'transfer'){setTypeCashOut(0);setTypeTransfer(1)}}}
  const handleTransactionType = (e) => {
    if (e.currentTarget.value == "transfer") {
      typeTransfer.current = true;
      typeCashOut.current = false;
    } else {
      typeCashOut.current = true;
      typeTransfer.current = false;
    }
  };
  const handleTransactionTime = (e) => {
    TransactionTime.current = parseInt(e.currentTarget.value);
    // console.log(TransactionTime);
  };
  return (
    <div className="flex justify-center container p-4 self-center">
      <div className="w-1/2 h-full ">
        {showResultModal && (
          <ResultModal
            queriesUpdate={queriesUpdate}
            setQueriesUpdate={setQueriesUpdate}
            queryData={datajson}
            result={modalData}
            show={showResultModal}
            onHide={() => setShowResultModal(false)}
            showResultState={{ showResultModal, setShowResultModal }}
          />
        )}
        <Form onSubmit={handleSubmit} id="mainForm">
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formOldBalanceOrig">
              <Form.Label>Old Origin Balance</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  placeholder="Enter amount "
                  autoComplete="off"
                  onChange={(e) => {
                    oldBalanceOrig.current = parseInt(e.target.value);
                  }}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} controlId="formnNewBalanceOrig">
              <Form.Label>New Origin Balance</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  placeholder="Enter amount "
                  autoComplete="off"
                  onChange={(e) => {
                    newBalanceOrig.current = parseInt(e.target.value);
                  }}
                />
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formOldBalanceDest">
              <Form.Label>Old Destination Balance</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  placeholder="Enter amount "
                  autoComplete="off"
                  onChange={(e) => {
                    oldBalanceDest.current = parseInt(e.target.value);
                  }}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} controlId="formnNewBalanceDest">
              <Form.Label>New Destination Balance</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  placeholder="Enter amount "
                  autoComplete="off"
                  onChange={(e) => {
                    newBalanceDest.current = parseInt(e.target.value);
                    // console.log(
                    //   "newBalanceDest.current > ",
                    //   newBalanceDest.current
                    // );
                  }}
                />
              </InputGroup>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="formTransferAmount">
              <Form.Label>Enter Transaction amount</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  placeholder="Enter amount "
                  autoComplete="off"
                  onChange={(e) => {
                    transactionAmount.current = parseInt(e.target.value);
                  }}
                />
              </InputGroup>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Select the type of Transaction</Form.Label>
              <Form.Select
                defaultValue="Choose..."
                onChange={handleTransactionType}
              >
                {/* <option>CASH-IN</option> */}
                <option id="transactionTypeCash" value="cash">
                  CASH_OUT
                </option>
                {/* <option>DEBIT</option> */}
                <option id="transactionTypeTransfer" value="transfer">
                  TRANSFER
                </option>
                {/* <option>PAYMENT</option> */}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formTimeofTransaction">
              <Form.Label>Select the time of Transaction</Form.Label>
              <Form.Select
                defaultValue="Choose..."
                onChange={handleTransactionTime}
              >
                <option value="1">00:00 - 01:00</option>
                <option value="2">01:00 - 02:00</option>
                <option value="3">02:00 - 03:00</option>
                <option value="4">03:00 - 04:00</option>
                <option value="5">04:00 - 05:00</option>
                <option value="6">05:00 - 06:00</option>
                <option value="7">06:00 - 07:00</option>
                <option value="8">07:00 - 08:00</option>
                <option value="9">08:00 - 09:00</option>
                <option value="10">09:00 - 10:00</option>
                <option value="11">10:00 - 11:00</option>
                <option value="12">11:00 - 12:00</option>
                <option value="13">12:00 - 13:00</option>
                <option value="14">13:00 - 14:00</option>
                <option value="15">14:00 - 15:00</option>
                <option value="16">15:00 - 16:00</option>
                <option value="17">16:00 - 17:00</option>
                <option value="18">17:00 - 18:00</option>
                <option value="19">18:00 - 19:00</option>
                <option value="20">19:00 - 20:00</option>
                <option value="21">20:00 - 21:00</option>
                <option value="22">21:00 - 22:00</option>
                <option value="23">22:00 - 23:00</option>
                <option value="24">23:00 - 00:00</option>
              </Form.Select>
            </Form.Group>
          </Row>

          {/* <Form.Group className="mb-3" controlId="formTransactionAlias">
            <Form.Label>Enter Alias</Form.Label>
            <Form.Control
              placeholder="Enter an alias for this query (ex: JHN-09-02-03)"
              autoComplete="off"
              onChange={(e) => {
                transactionAlias = e.target.value;
              }}
            />
          </Form.Group> */}
          {/* <div className='flex justify-center container bg-orange-200'>
                        <Row className="mb-3 flex flex-col">
                            <div className='flex'>
                                <Form.Group as={Col} controlId="formTimeofTransaction">
                                    <Form.Label>Select the Time of Transaction</Form.Label>
                                    <Form.Select defaultValue="Choose...">
                                        <option>00:00 - 01:00</option>
                                        <option>01:00 - 02:00</option>
                                        <option>02:00 - 03:00</option>
                                        <option>03:00 - 04:00</option>
                                        <option>04:00 - 05:00</option>
                                        <option>05:00 - 06:00</option>
                                        <option>06:00 - 07:00</option>
                                        <option>07:00 - 08:00</option>
                                        <option>08:00 - 09:00</option>
                                        <option>09:00 - 10:00</option>
                                        <option>10:00 - 11:00</option>
                                        <option>11:00 - 12:00</option>
                                   </Form.Select>
                                </Form.Group>
                            </div>
                            <div className='flex bg-slate-50'>
                                <Form.Group as={Col} controlId="formTimeofTransaction">
                                    <div className='flex-1'>
                                    <span>AM</span>
                                    </div>
                                    <Form.Check type="switch" id="custom-switch" label="PM" />
                                </Form.Group>
                            </div>
                        </Row>
                    </div> */}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ContentDashboard;
