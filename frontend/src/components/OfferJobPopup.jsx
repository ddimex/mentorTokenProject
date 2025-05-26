const OfferJobPopup = ({
  offerJobData,
  handleOfferChange,
  handleOfferSubmit,
  onCancel,
  onOfferSubmit,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleOfferSubmit();
    onOfferSubmit();
    onCancel();
  };

  return (
    <div>
      <div className="popupContainer flexCol alignCenter justifyCenter">
        <div className="popupCard flexCol alignCenter">
          <svg
            onClick={onCancel}
            width="20"
            height="20"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.75 4.25L4.25 12.75"
              stroke="#696CFF"
              strokeWidth="1.41667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.25 4.25L12.75 12.75"
              stroke="#696CFF"
              strokeWidth="1.41667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="popupCardContent flexCol alignCenter spaceBetween">
            <h3 className="font loginTitle" style={{ marginBottom: "30px" }}>
              Offer New Job
            </h3>
            <form
              onSubmit={handleSubmit}
              className="flexCol alignCenter"
              style={{ gap: "5px" }}
            >
              <div
                className="inputWrapper flexCol alignCenter"
                style={{ margin: "5px" }}
              >
                <input
                  type="text"
                  name="title"
                  placeholder=" "
                  value={offerJobData.title}
                  onChange={handleOfferChange}
                />
                <label> Job Title </label>
              </div>

              <div
                className="inputWrapper flexCol alignCenter"
                style={{ margin: "5px" }}
              >
                <input
                  type="text"
                  name="description"
                  placeholder=" "
                  value={offerJobData.description}
                  onChange={handleOfferChange}
                />
                <label> Job Description </label>
              </div>

              <button
                className="acceptBtn"
                style={{ marginTop: "15px", fontSize: "16px" }}
              >
                Send Offer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferJobPopup;
