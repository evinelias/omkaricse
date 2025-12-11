import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { usePopup } from '../../contexts/PopupContext';
import CustomSelect from './CustomSelect';

const AdmissionPopup: React.FC = () => {
    const { isPopupOpen, openPopup, closePopup } = usePopup();
    const [isClosing, setIsClosing] = useState(false);
    const [gradeLevel, setGradeLevel] = useState('');

    useEffect(() => {
        const hasBeenShown = sessionStorage.getItem('admissionPopupShown');
        if (!hasBeenShown) {
            const timer = setTimeout(() => {
                openPopup();
                sessionStorage.setItem('admissionPopupShown', 'true');
            }, 3000); // 3-second delay
            return () => clearTimeout(timer);
        }
    }, [openPopup]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            closePopup();
            setIsClosing(false);
        }, 300); // Match animation duration
    };

    if (!isPopupOpen) {
        return null;
    }
    
    // Kept standard opaque background for inputs for high contrast
    const inputClasses = "block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-400 transition";
    
    const gradeOptions = [
        "Mont I",
        "Mont II",
        "Mont III",
        "Grade I",
        "Grade II",
        "Grade III",
        "Grade IV",
        "Grade V",
        "Grade VI",
        "Grade VII",
        "Grade VIII",
        "Grade IX",
    ];

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            {/* Opaque dark overlay without backdrop-blur for a solid "stand out" look */}
            <div className="fixed inset-0 bg-black/90" onClick={handleClose}></div>
            
            <div className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transition-transform duration-300 transform ${isClosing ? 'scale-95' : 'scale-100'}`}>
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 text-slate-800 dark:text-white hover:bg-black/20 transition-colors"
                    aria-label="Close popup"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 hidden md:block relative">
                    <img
                        src="https://lh3.googleusercontent.com/pw/AP1GczMbpX8exTXFwY-sOqlMrXMQEbZQBRePV-4SqbRSeJXf-AMXOAaFEPfizwDIvLZ4CyRrbttp02NtnTZFtBhld4U545p6mAzilPFknsX98IAjA9MT8z2g87kuRyowbn26gwgl4XrXW3K5gooQ-jW2chcL=w1386-h924-s-no-gm?authuser=1"
                        alt="Admissions Open"
                        className="w-full h-full object-cover"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto bg-white dark:bg-slate-900">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admissions Open!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">Secure your child's future at Omkar International School. Fill out the form below to start the admission process.</p>
                    <form className="space-y-5">
                         <div>
                            <label htmlFor="popup-parent-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent/Guardian Name</label>
                            <input type="text" id="popup-parent-name" className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="popup-mobile" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                            <input 
                                type="tel" 
                                id="popup-mobile" 
                                className={inputClasses} 
                                required 
                                pattern="[0-9]{10}" 
                                title="Please enter a valid 10-digit mobile number."
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <label htmlFor="popup-student-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                            <input type="text" id="popup-student-name" className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="popup-grade-level" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade Level of Interest</label>
                            <CustomSelect
                                id="popup-grade-level"
                                options={gradeOptions}
                                value={gradeLevel}
                                onChange={setGradeLevel}
                                placeholder="Select a grade..."
                                required
                                direction="up"
                            />
                        </div>
                        <button type="submit" className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105">
                            <Send className="w-5 h-5 mr-2" />
                            Submit Inquiry
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default AdmissionPopup;