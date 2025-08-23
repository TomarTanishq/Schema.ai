import React, { useEffect, useState } from 'react'
import { useForm, ValidationError } from '@formspree/react';

const Review = () => {
    const [state, handleSubmit] = useForm("mnnzervo");
    const [name, setName] = useState("")
    const [review, setReview] = useState("")

    useEffect(() => {
        if (state.succeeded) {
            setName('')
            setReview('')
        }
    }, [state.succeeded])
    return (
        <div className='w-full pt-10 bg-[#1b1e2b] pb-2 text-gray-200 px-5 md:px-0'>
            <div className='max-w-6xl mx-auto'>
                {/* Heading */}
                <div className='flex justify-start items-center'>
                    <h1 className='text-4xl font-poppins text-gray-300 font-semibold'>Write a Review</h1>
                </div>
                {/* Form */}
                <div className='mt-10'>
                    <form action="https://formspree.io/f/mnnzervo" method='POST' onSubmit={handleSubmit} className='font-poppins'>
                        <div className='grid grid-cols-1 md:grid-cols-2'>
                            <div className='flex flex-col'>
                                <label htmlFor="email">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='mt-2 px-2 py-2 text-sm outline outline-gray-500 rounded-md'
                                />
                                <label htmlFor="message" className='mt-5'>
                                    Review
                                </label>
                                <textarea
                                    id="review"
                                    name="review"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    className='mt-2 px-2 py-2 text-sm outline outline-gray-500 rounded-md resize-none min-h-20'
                                />
                                <ValidationError
                                    prefix="Message"
                                    field="message"
                                    errors={state.errors}
                                />
                                <button type="submit" disabled={state.submitting} className='flex justify-start mt-5 outline outline-gray-500 max-w-fit px-2 py-2 rounded-md cursor-pointer active:bg-[#1b1e2b]'>
                                    Submit
                                </button>
                            </div>
                            <div className='flex flex-col items-center justify-center mt-15 md:mt-0'>
                                {state.succeeded && (
                                    <div className='text-center text-green-200'>
                                        <h2>Thank You! 👍</h2>
                                        <p>Your review has been submitted.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                {/* SemiFooter */}
                <div className='mt-15 font-poppins text-sm'>
                    <a
                        href="https://www.linkedin.com/in/tomartanishq"
                        target='_blank'
                        className="text-blue-400 hover:underline"
                    >
                        LinkedIn
                    </a>
                    <span className='text-gray-600 mx-2'>|</span>
                    <a
                        href="mailto:tanishqtomar4@gmail.com"
                        target='_blank'
                        className="text-blue-400 hover:underline"
                    >
                        Gmail
                    </a>
                </div>

            </div>


        </div>
    )
}

export default Review
