import React, { createContext, useState, useContext } from 'react';
import { getPrice } from '../utils/pricingLogic';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState({
    bookingId: null,
    mobile: '',
    city: '',
    carBrand: null,
    carModel: null,
    service: null,
    date: '',
    timeSlot: '',
    finalPrice: 0,
    currentStep: 1,
    isModalOpen: false,
  });

  const updateBooking = (key, value) => {
    setBookingState(prev => {
      const newState = { ...prev, [key]: value };

      if (key === 'carModel' || key === 'service') {
        const category = newState.carModel?.category;
        const service = newState.service;
        if (category && service) {
          newState.finalPrice = getPrice(category, service);
        } else {
          newState.finalPrice = 0;
        }
      }
      return newState;
    });
  };

  const nextStep = () => setBookingState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  const prevStep = () => setBookingState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  const setStep = (step) => setBookingState(prev => ({ ...prev, currentStep: step }));
  
  const openModal = (carArg = null, service = null, specificStep = null) => {
    setBookingState(prev => {
      const car = (carArg && carArg.category) ? carArg : null;

      // Determine target step based on pre-selections
      let targetStep = 2; // Default after mobile is City
      if (typeof specificStep === 'number') {
        targetStep = specificStep;
      } else {
        if (car && service) targetStep = 6;
        else if (car) targetStep = 5;
      }

      // If they haven't submitted a mobile number yet, force Step 1
      const step = prev.bookingId ? targetStep : 1;

      const newState = { ...prev, isModalOpen: true, currentStep: step };

      if (car) {
        newState.carModel = car;
        newState.carBrand = car.name.split(' ')[0];
      }
      if (service) {
        newState.service = service;
        if (car) {
          newState.finalPrice = getPrice(car.category, service);
        }
      }
      
      // Auto-fill city if empty
      if (!newState.city) {
        newState.city = 'Lucknow';
      }
      
      return newState;
    });
  };
  
  const closeModal = () => setBookingState(prev => ({ ...prev, isModalOpen: false }));

  const resetBooking = () => {
    setBookingState({
      bookingId: null,
      mobile: '',
      city: '',
      carBrand: null,
      carModel: null,
      service: null,
      date: '',
      timeSlot: '',
      finalPrice: 0,
      currentStep: 1,
      isModalOpen: false,
    });
  };

  return (
    <BookingContext.Provider value={{
      bookingState,
      updateBooking,
      nextStep,
      prevStep,
      setStep,
      openModal,
      closeModal,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};
