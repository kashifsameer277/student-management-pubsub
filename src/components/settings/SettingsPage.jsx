
import { useState } from "react";
import EventBus from "../../pubsub/EventBus";
import { EVENTS } from "../../pubsub/events";
const SettingsPage = () => {
 const savedSettings = JSON.parse(
  localStorage.getItem("instituteSettings")
) || {};

const [instituteName, setInstituteName] = useState(
  savedSettings.instituteName || "Radiant Coaching Centre"
);

const [address, setAddress] = useState(
  savedSettings.address || ""
);

const [phone, setPhone] = useState(
  savedSettings.phone || ""
);

const [email, setEmail] = useState(
  savedSettings.email || ""
);
  const handleSave = (e) => {
    e.preventDefault();

    const settings = {
      instituteName,
      address,
      phone,
      email,
    };

    localStorage.setItem(
      "instituteSettings",
      JSON.stringify(settings)
    );
    EventBus.publish(
  EVENTS.SETTINGS_UPDATED,
  settings
);

    alert("Settings saved successfully!");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">⚙️ Settings</h2>

      <div className="card">
        <div className="card-body">
          <h4 className="mb-4">
            🏫 Institute Profile
          </h4>

          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label">
                Institute Name
              </label>

              <input
                type="text"
                className="form-control"
                value={instituteName}
                onChange={(e) =>
                  setInstituteName(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Address
              </label>

              <textarea
                className="form-control"
                rows="3"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Phone Number
              </label>

              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Email Address
              </label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              💾 Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

