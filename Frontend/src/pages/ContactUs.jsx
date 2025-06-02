import React from "react";

const ContactUs = () => {
    return (
        <div className="bg-white w-full min-h-screen py-50 px-6 md:px-16 lg:px-32">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                    Have questions? Need help? Our team is ready to assist you. Reach out to us anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Form */}
                <div>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-red-500 focus:border-red-500"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-red-500 focus:border-red-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                rows="5"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-red-500 focus:border-red-500"
                                placeholder="Write your message..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Right: Contact Info */}
                <div>
                    <h2 className="text-2xl font-semibold text-black mb-4">Get in Touch</h2>
                    <p className="text-gray-600 mb-4">
                        <strong>Email:</strong> support@jerseyworld.com
                    </p>
                    <p className="text-gray-600 mb-4">
                        <strong>Phone:</strong> +1 (604) 567-890
                    </p>
                    <p className="text-gray-600 mb-4">
                        <strong>Address:</strong> 123 Football Street, UBC, BC 07302
                    </p>
                    <p className="text-gray-600">
                        Follow us on social media to stay updated with the latest drops and exclusive deals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;