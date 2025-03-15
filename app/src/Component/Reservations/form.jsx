import React, { useState, useEffect } from "react";
import PopupCard from "./Confirmation";
import { useLocation } from "react-router-dom";
import AnimatedCheck from "./Status/Confirmed";
import AnimatedReserved from "./Status/Failed";

export default function FormResev({ Terrain, selectedHour, selectedTime  }) {
  const location = useLocation();
  const [reserv, setReserv] = useState({
    idTerrain: Terrain,
    date: selectedTime || "", // default date is empty
    heuredebut: selectedHour || "", // use selectedHour prop if not null
    heurefin: "",
    id_compte: location.pathname !== "/Admin" ? sessionStorage.getItem("userId") : null,
    type: sessionStorage.getItem("type"),
  });
  const [errors, setErrors] = useState({});
  const [resetPopup, setResetPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const times = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
  ];

  useEffect(() => {
    setReserv((prev) => ({ ...prev, idTerrain: Terrain }));
    setIsVisible(false);

    if (selectedHour) {
      const [hour, minute] = selectedHour.split(":"); // Split hour and minute
      let newHour = parseInt(hour, 10) + 1; // Increment the hour
      if (newHour === 24) newHour = 0; // Handle the edge case for 23:00 -> 00:00

      setReserv((prev) => ({
        ...prev,
        date: selectedTime || prev.date,
        heuredebut: selectedHour || prev.heuredebut,
        heurefin: `${newHour.toString().padStart(2, "0")}:${minute}`, // Construct the new heurefin
      }));
    }
  }, [selectedHour, selectedTime, Terrain]);

  const resetStatus = () => {
    setResetPopup(false);
    setIsVisible(false);
  };

  const validate = (name, value) => {
    let errorMsg = "";

    if (!value) errorMsg = "Ce champ est obligatoire.";
    else if (name === "heurefin" && !compareTimes(reserv.heuredebut, value)) {
      errorMsg = "Heure fin doit être après heure de début.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const compareTimes = (start, end) => {
    return new Date(`1970-01-01T${start}:00Z`) < new Date(`1970-01-01T${end}:00Z`);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const [Success, setSuccess] = useState(false);
  const [Failed, setFailed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const newErrors = {};
    for (const field in reserv) {
      if (!reserv[field]) {
        newErrors[field] = "Ce champ est obligatoire.";
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservDate = new Date(reserv.date);
    reservDate.setHours(0, 0, 0, 0);

    if (reservDate < today) {
      newErrors.date = "La date ne peut pas être dans le passé.";
    } else {
      const currentTime = new Date();
      const reservHeureDebut = new Date(reserv.date + " " + reserv.heuredebut);

      if (reservHeureDebut < currentTime) {
        newErrors.heuredebut = "L'heure de début ne peut pas être dans le passé.";
      } else if (
        reserv.heuredebut &&
        reserv.heurefin &&
        !compareTimes(reserv.heuredebut, reserv.heurefin)
      ) {
        newErrors.heurefin = "L'heure de fin doit être après l'heure de début.";
      }
    }

    console.log("Validation Errors:", newErrors);
    setErrors(newErrors);
    console.log(reserv);

    if (Object.keys(newErrors).length === 0) {
        console.log("No errors, proceeding with submission");
        if (location.pathname === "/Admin") {
            try {
                const response = await fetch(
                    "http://localhost/PFR/3AFAK-PFE/backend/Controleur/ReserverHour.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        credentials: 'include',
                        body: JSON.stringify(reserv),
                    }
                );

                const data = await response.json();
                
                if (!response.ok) {
                    setFailed(true);
                    throw new Error(data.message || "Une erreur est survenue lors de la réservation.");
                }

                setSuccess(true);
                
                setTimeout(() => {
                    setSuccess(false);
                    // Optional: Reset form
                    setReserv({
                        idTerrain: Terrain,
                        date: "",
                        heuredebut: "",
                        heurefin: "",
                        id_compte: location.pathname !== "/Admin" ? sessionStorage.getItem("userId") : "",
                        type: sessionStorage.getItem("type"),
                    });
                }, 2000);

            } catch (error) {
                console.error("Error submitting form:", error);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    api: error.message || "Erreur de communication avec le serveur.",
                }));
                setFailed(true);
            }
        } else {
            setIsVisible(true);
        }
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setReserv((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  return (
    <>
      <div className="flex justify-center items-center h-auto">
        <div className="bg-dark-gray bg-opacity-35 h-fit p-6 rounded-lg w-full max-w-md">
          <form onSubmit={handleSubmit}>
            {location.pathname === "/Admin" && (
              <>
                <label className="block text-left text-sm text-white font-medium mb-1">
                  ID
                </label>
                <input
                  type="text"
                  name="id_compte"
                  className="w-full mb-2 p-3 text-dark rounded-lg outline-none"
                  onChange={onChange}
                  value={reserv.id_compte}
                  placeholder="Entre l'id du compte"
                />
              </>
            )}

            <label className="block text-left text-sm text-white font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              className="w-full mb-2 p-3 text-dark rounded-lg outline-none"
              onChange={onChange}
              value={reserv.date}
            />
            {errors.date && <p className="text-red-500 text-sm mb-4">{errors.date}</p>}

            <label className="block text-left text-sm text-white font-medium mb-1">
              Heure Début
            </label>
            <select
              name="heuredebut"
              className="w-full mb-2 p-3 text-dark rounded-lg outline-none"
              onChange={onChange}
              value={reserv.heuredebut || ""}
            >
              <option value="">Sélectionnez une heure</option>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.heuredebut && <p className="text-red-500 text-sm mb-4">{errors.heuredebut}</p>}

            <label className="block text-left text-sm text-white font-medium mb-1">
              Heure Fin
            </label>
            <select
              name="heurefin"
              className="w-full mb-2 p-3 text-dark rounded-lg outline-none"
              onChange={onChange}
              value={reserv.heurefin}
            >
              <option value="">Sélectionnez une heure</option>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.heurefin && <p className="text-red-500 text-sm mb-4">{errors.heurefin}</p>}

            <button
              type="submit"
              className="w-full p-3 mt-3 bg-bright-green text-black font-semibold rounded-lg hover:bg-green-500 transition"
            >
              Réserver
            </button>
          </form>
        </div>
      </div>

      {isVisible && (
        <PopupCard
          isVisible={isVisible}
          onClose={handleClose}
          data={reserv}
          pym={reserv.paymentMethod}
          resetStatus={resetStatus}
        />
      )}

      {Success && <AnimatedCheck />}
      {Failed && <AnimatedReserved />}
    </>
  );
}