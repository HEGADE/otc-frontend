import { ValidationError } from "../UI/Errors";

export const WalletComponent = ({
  orderData,
  handleOnInputChange,
  handleOrderSubmit,
  userBankDetails,
  adminWalletDetails,
  validationErrors,
}) => {
  console.log("🟠🟡🟢 adminWalletDetails: ", adminWalletDetails);

  return (
    <div className="col-lg-12">
      <div className="row gy-5 gy-md-6 justify-content-center">
        <div className="col-lg-6 col-xxl-12">
          <div className="buy_crypto__formarea p-6 p-px-8 rounded-20 bg7-color wow fadeInUp">
            <h3 className="p6-color mb-6 mb-md-8">Admin Wallet Details</h3>
            <form onSubmit={(e) => handleOrderSubmit(e)}>
              <div className="contact_info__inpuarea mb-6 mb-md-8 bg1-color br2 rounded-20 p-3">
                <div className="contact_info__inpuarea-group gap-5 gap-md-6 mb-4 position-relative">
                  <label for="first-name" className="form-label text-white">
                    Wallet Address
                  </label>
                  <input
                    className="bg4-color"
                    type="text"
                    Value={adminWalletDetails.walletAddress}
                    disabled={true}
                  />
                  <div className="tick-mark">
                    <i className="fa fa-copy text-white"></i>
                  </div>
                </div>
              </div>
              <br />
              <h3 className="p6-color mb-6 mb-md-8">My Bank Details</h3>
              <div className="contact_info__inpuarea mb-6 mb-md-8 bg1-color br2 rounded-20 p-3">
                <div className="contact_info__inpuarea-group gap-5 gap-md-6 mb-4 position-relative">
                  <label
                    for="user-account-number"
                    className="form-label text-white"
                  >
                    Account Number
                  </label>
                  <input
                    className="bg4-color"
                    type="text"
                    Value={userBankDetails.accountNumber}
                    disabled={true}
                  />
                  <div className="tick-mark">
                    <i className="fa fa-copy text-white"></i>
                  </div>
                </div>
              </div>
              <br />
              <div className="buy_crypto__formarea-group mb-6 mb-md-8">
                <label className="mb-2">Primary Transaction Receipt</label>
                <div className="br2 p-1 rounded-4 bg1-color">
                  <input
                    name="primaryTransactionReceipt"
                    value={orderData.primaryTransactionReceipt}
                    type="text"
                    className="form-control showhide-pass"
                    id="input-primary-transaction-receipt"
                    placeholder="Enter primary transaction receipt"
                    onChange={(event) => handleOnInputChange(event)}
                  />
                </div>
              </div>
              <ValidationError
                err={validationErrors.primaryTransactionReceipt}
              />
              <br />
              <button
                type="submit"
                className="roboto fw-bold cmn-btn px-5 px-md-6 py-3"
              >
                Submit Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};