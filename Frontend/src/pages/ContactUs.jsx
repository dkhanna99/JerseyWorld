import React, { useState } from "react";
import { API_ENDPOINTS } from "../config";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setError('Please fill in all fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_ENDPOINTS.CONTACT}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    message: formData.message.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
                // Reset success message after 5 seconds
                setTimeout(() => setSuccess(false), 5000);
            } else {
                setError(data.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 py-12">
            <div className="max-w-6xl w-full">
                <div className="text-center mb-12 mt-30">
                    <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
                    <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                        Have questions? Need help? Our team is ready to assist you. Reach out to us anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left: Form */}
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        {success && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                                Message sent successfully! We will get back to you soon.
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Write your message..."
                                    required
                                ></textarea>
                            </div>

                            <button 
                                style={{ backgroundColor: 'red', color: '#ffffff' }}
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 "></div>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Contact Info */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-2xl font-semibold text-black mb-4">Get in Touch</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                <strong>Email:</strong>{' '}
                                <a href="mailto:support@jerseyworld.com" className="text-red-600 hover:text-red-700 underline">
                                    support@jerseyworld.com
                                </a>
                            </p>
                            <p className="text-gray-600">
                                <strong>Phone:</strong>{' '}
                                <a href="tel:+1604567890" className="text-red-600 hover:text-red-700 underline">
                                    +1 (604) 567-890
                                </a>
                            </p>
                            <p className="text-gray-600">
                                <strong>Address:</strong> 123 Football Street, UBC, BC 07302
                            </p>
                            <p className="text-gray-600">
                                Follow us on social media to stay updated with the latest drops and exclusive deals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;