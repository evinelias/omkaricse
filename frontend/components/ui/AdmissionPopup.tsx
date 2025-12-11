import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { usePopup } from '../../contexts/PopupContext';
import CustomSelect from './CustomSelect';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import api from '../../api';

const AdmissionPopup: React.FC = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { isPopupOpen, openPopup, closePopup } = usePopup();
    const [isClosing, setIsClosing] = useState(false);
    const [gradeLevel, setGradeLevel] = useState('');
    const [formData, setFormData] = useState({
        parentName: '',
        mobile: '',
        studentName: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

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
            setSubmitStatus(null); // Reset status on close
        }, 300); // Match animation duration
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        // Map IDs to state keys
        let stateKey = '';
        if (id === 'popup-parent-name') stateKey = 'parentName';
        else if (id === 'popup-mobile') stateKey = 'mobile';
        else if (id === 'popup-student-name') stateKey = 'studentName';
        else if (id === 'popup-email') stateKey = 'email';

        if (stateKey) {
            setFormData(prev => ({ ...prev, [stateKey]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            if (!executeRecaptcha) {
                console.warn('Execute recaptcha not yet available');
                setSubmitStatus({ success: false, message: 'Captcha not ready.' });
                setIsSubmitting(false); // Ensure submitting state is reset
                return;
            }

            const token = await executeRecaptcha('admission_popup');

            await api.post('/leads', {
                name: formData.parentName,
                studentName: formData.studentName,
                phone: formData.mobile,
                email: formData.email,
                source: 'popup',
                inquiryType: 'Admissions Inquiry',
                grade: gradeLevel,
                message: `Inquiry from Popup`,
                status: 'NEW',
                token // Add token
            });

            setSubmitStatus({ success: true, message: 'Inquiry submitted successfully!' });
            setFormData({ parentName: '', mobile: '', studentName: '', email: '' });
            setGradeLevel('');

            // Auto close after 3 seconds
            setTimeout(handleClose, 3000);

        } catch (error) {
            console.error(error);
            setSubmitStatus({ success: false, message: 'Failed to submit. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
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
        "Grade XI",
        "Grade XII",
    ];

    return (
        <div className={`fixed inset - 0 z - [100] flex items - center justify - center p - 4 transition - opacity duration - 300 ${isClosing ? 'opacity-0' : 'opacity-100'} `}>
            {/* Opaque dark overlay without backdrop-blur for a solid "stand out" look */}
            <div className="fixed inset-0 bg-black/90" onClick={handleClose}></div>

            <div className={`relative bg - white dark: bg - slate - 900 border border - slate - 200 dark: border - slate - 700 rounded - 2xl shadow - 2xl w - full max - w - 4xl max - h - [90vh] overflow - hidden flex flex - col md: flex - row transition - transform duration - 300 transform ${isClosing ? 'scale-95' : 'scale-100'} `}>
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
                        src="/images/popup-bg.jpg"
                        alt="Admissions Open"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto bg-white dark:bg-slate-900">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admissions Open!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">Secure your child's future at Omkar International School. Fill out the form below to start the admission process.</p>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="popup-parent-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent/Guardian Name</label>
                            <input type="text" id="popup-parent-name" value={formData.parentName} onChange={handleInputChange} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="popup-mobile" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                id="popup-mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit mobile number."
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <label htmlFor="popup-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                            <input type="email" id="popup-email" value={formData.email} onChange={handleInputChange} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="popup-student-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                            <input type="text" id="popup-student-name" value={formData.studentName} onChange={handleInputChange} className={inputClasses} required />
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
                        <div className="space-y-4">
                            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                                <Send className="w-5 h-5 mr-2" />
                                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                            </button>

                            {submitStatus && (
                                <div className={`p - 3 rounded - lg flex items - center justify - center space - x - 2 animate - fade -in -up ${submitStatus.success ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'} `}>
                                    {submitStatus.success ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <X className="w-5 h-5" />
                                    )}
                                    <span className="font-semibold">{submitStatus.message}</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default AdmissionPopup;