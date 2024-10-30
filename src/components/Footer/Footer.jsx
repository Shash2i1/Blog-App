import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
    return (
        <section className="relative overflow-hidden py-10 bg-[#C1C2C6] border border-t-2">
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="-m-6 flex flex-wrap">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center">
                                <Logo width="100px" />
                            </div>
                            <p className="text-sm text-gray-600">
                                &copy; Copyright 2024. All Rights Reserved by Shashank Patgar.
                            </p>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-gray-500">Company</h3>
                        <ul>
                            {["Features", "Pricing", "Affiliate Program"].map((item) => (
                                <li key={item} className="mb-4">
                                    <Link
                                        className="text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-gray-500">Support</h3>
                        <ul>
                            {["Help", "Contact Us", "Customer Support"].map((item) => (
                                <li key={item} className="mb-4">
                                    <Link
                                        className="text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-gray-500">Legals</h3>
                        <ul>
                            {["Terms & Conditions", "Privacy Policy", "Licensing"].map((item) => (
                                <li key={item} className="mb-4">
                                    <Link
                                        className="text-base font-medium text-gray-900 hover:text-gray-700"
                                        to="/"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Footer;
