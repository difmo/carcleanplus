import React, { createContext, useState, useContext } from 'react';
import { getPrice } from '../utils/pricingLogic';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState({
    carModel: null, // { id, name, category }
    service: null, // Basic Wash, Premium Wash, etc.
    location: {
      address: '',
      pincode: '',
    },
    date: '',
    timeSlot: '',
    customerDetails: {
      fullName: '',
      mobile: '',
      carNumber: '',
      instructions: '',
    },
    finalPrice: 0,
    currentStep: 1,
    isModalOpen: false,
  });

  const updateBooking = (key, value) => {
    setBookingState(prev => {
      const newState = { ...prev, [key]: value };
      
      // Auto calculate price if car and service are selected
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
  const openModal = () => setBookingState(prev => ({ ...prev, isModalOpen: true, currentStep: 1 }));
  const closeModal = () => setBookingState(prev => ({ ...prev, isModalOpen: false }));
  
  const resetBooking = () => {
    setBookingState({
      carModel: null,
      service: null,
      location: { address: '', pincode: '' },
      date: '',
      timeSlot: '',
      customerDetails: { fullName: '', mobile: '', carNumber: '', instructions: '' },
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
