import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { MapPin, Phone, Mail, X, CheckCircle } from 'lucide-react';
import PageSEO from '../components/ui/PageSEO';
import CustomSelect from '../components/ui/CustomSelect';
import api from '../api';

// FIX: Update icon prop type to allow passing strokeWidth to lucide icons.
const ContactCard: React.FC<{ icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 rounded-2xl shadow-lg text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-t-4 border-amber-400 h-full">
        <div className="flex justify-center items-center mb-5">
            <div className="bg-amber-100 dark:bg-slate-700 p-4 rounded-full">
                <Icon className="w-9 h-9 text-amber-500 dark:text-amber-400" strokeWidth={1.5} />
            </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
        <div className="text-slate-600 dark:text-slate-400 space-y-1">{children}</div>
    </div>
);


const ContactPage: React.FC = () => {
    const [inquiryType, setInquiryType] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [referralSource, setReferralSource] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        studentName: '' // Added studentName to formData
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Explicitly define type for error state
    const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

    const showAdmissionsFields = inquiryType === 'Admissions Inquiry';

    const inquiryOptions = [
        "Admissions Inquiry",
        "General Inquiry",
        "Feedback",
        "Careers",
    ];

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

    const referralOptions = [
        "Website",
        "Social Media",
        "Times of India",
        "Parents referral",
    ];

    const inputClasses = "block w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-300/50 dark:border-slate-600/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-slate-400 transition";

    const nameLabel = (inquiryType === 'General Inquiry' || inquiryType === 'Feedback' || inquiryType === 'Careers')
        ? 'Your Name'
        : 'Parent/Guardian Name';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await api.post('/leads', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                studentName: formData.studentName,
                inquiryType: inquiryType,
                source: referralSource ? referralSource.toLowerCase().replace(/ /g, '_') : 'contact_page',
                grade: showAdmissionsFields ? gradeLevel : undefined,
                // Combine other fields into message or dedicated fields if backend supports
                city: '', // Contact page doesn't ask for city explicitly
            });
            setSubmitStatus({ success: true, message: 'Message sent successfully!' });
            // Reset form
            setFormData({ name: '', email: '', phone: '', message: '', studentName: '' });
            setInquiryType('');
            setGradeLevel('');
            setReferralSource('');
        } catch (error) {
            console.error(error);
            setSubmitStatus({ success: false, message: 'Failed to send message. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageSEO
                title="Contact Us - Omkar International School | Best School in Dombivli"
                description="Get in touch with Omkar International School. Find our address, phone numbers, email, and location map. Contact the best school in Dombivli today."
            />
            <PageHeader
                title="Contact Us"
                subtitle="We'd love to hear from you. Keep in touch!"
            />
            <div className="container mx-auto px-6 py-20 lg:py-28">
                {/* Contact Info Cards */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">Get in Touch</h2>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">We are here to help and answer any question you might have.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                    <ContactCard icon={MapPin} title="Our Address">
                        <p>P-74/P-89, MIDC Residential Zone, Dombivli East, Maharashtra 421203</p>
                    </ContactCard>
                    <ContactCard icon={Phone} title="Call Us">
                        <p><a href="tel:+918451007436" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+91 84510 07436</a></p>
                        <p><a href="tel:+919324135966" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+91 93241 35966</a></p>
                        <p><a href="tel:+919702934444" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+91 97029 34444</a></p>
                    </ContactCard>
                    <ContactCard icon={Mail} title="Email Us">
                        <a href="mailto:omkarschool@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">omkarschool@gmail.com</a>
                    </ContactCard>
                </div>

                {/* Form and Map */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Message Form */}
                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-12 rounded-xl shadow-xl">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-6">Leave a Message</h2>
                        {submitStatus && !submitStatus.success && (
                            <div className="mb-4 p-4 rounded bg-red-100 text-red-700">
                                {submitStatus.message}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="inquiryType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Inquiry Type</label>
                                <CustomSelect
                                    id="inquiryType"
                                    options={inquiryOptions}
                                    value={inquiryType}
                                    onChange={setInquiryType}
                                    placeholder="Select an inquiry type..."
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{nameLabel}</label>
                                <input type="text" id="name" value={formData.name} onChange={handleInputChange} className={inputClasses} required />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit mobile number."
                                    maxLength={10}
                                />
                            </div>

                            <div className={`space-y-6 transition-all duration-500 ease-in-out ${showAdmissionsFields ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div>
                                    <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                                    <input type="text" id="studentName" value={formData.studentName} onChange={handleInputChange} className={inputClasses} required={showAdmissionsFields} />
                                </div>
                                <div>
                                    <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade Level of Interest</label>
                                    <CustomSelect
                                        id="gradeLevel"
                                        options={gradeOptions}
                                        value={gradeLevel}
                                        onChange={setGradeLevel}
                                        placeholder="Select a grade level..."
                                        required={showAdmissionsFields}
                                        direction="up"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Optional)</label>
                                <input type="email" id="email" value={formData.email} onChange={handleInputChange} className={inputClasses} />
                            </div>

                            <div>
                                <label htmlFor="referralSource" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From where did you hear us?</label>
                                <CustomSelect
                                    id="referralSource"
                                    options={referralOptions}
                                    value={referralSource}
                                    onChange={setReferralSource}
                                    placeholder="Select a source..."
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                                <textarea id="message" value={formData.message} onChange={handleInputChange} rows={5} className={inputClasses} required></textarea>
                            </div>
                            <div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50">
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                                {submitStatus?.success && (
                                    <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center justify-center space-x-3 animate-fade-in-up mx-auto">
                                        <div className="bg-green-100 dark:bg-green-800 p-1.5 rounded-full">
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <p className="text-green-700 dark:text-green-300 font-semibold">
                                            Message received! We'll be in touch soon.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Google Map */}
                    <div className="rounded-xl shadow-xl overflow-hidden min-h-[400px] lg:min-h-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7535.402211352506!2d73.09652919214106!3d19.208252928094783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7950510c25fcd%3A0xbc4826b136461f62!2sOmkar%20International%20School%20CISCE!5e0!3m2!1sen!2sin!4v1759274675437!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Omkar International School Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;