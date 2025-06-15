import React, { useState, useEffect } from "react";
import { MdCheck, MdClose } from "react-icons/md";

/**
 * Password strength checker component
 * Used in password creation/update forms to provide feedback on password strength
 */
const PasswordStrengthChecker = ({ password }) => {
    const [score, setScore] = useState(0);
    const [lengthValid, setLengthValid] = useState(false);
    const [uppercaseValid, setUppercaseValid] = useState(false);
    const [lowercaseValid, setLowercaseValid] = useState(false);
    const [numberValid, setNumberValid] = useState(false);
    const [specialValid, setSpecialValid] = useState(false);

    useEffect(() => {
        // Check individual criteria
        setLengthValid(password.length >= 8);
        setUppercaseValid(/[A-Z]/.test(password));
        setLowercaseValid(/[a-z]/.test(password));
        setNumberValid(/[0-9]/.test(password));
        setSpecialValid(/[^A-Za-z0-9]/.test(password));

        // Calculate overall score (0-4)
        let newScore = 0;
        if (password.length >= 8) newScore++;
        if (/[A-Z]/.test(password)) newScore++;
        if (/[a-z]/.test(password)) newScore++;
        if (/[0-9]/.test(password)) newScore++;
        if (/[^A-Za-z0-9]/.test(password)) newScore++;
        setScore(newScore);
    }, [password]);

    const getStrengthLabel = () => {
        if (score === 0) return { text: "Very Weak", color: "text-red-600" };
        if (score <= 2) return { text: "Weak", color: "text-red-600" };
        if (score <= 3) return { text: "Medium", color: "text-yellow-600" };
        if (score <= 4) return { text: "Strong", color: "text-green-600" };
        return { text: "Very Strong", color: "text-green-700" };
    };

    const getProgressBarColor = () => {
        if (score === 0) return "bg-gray-200";
        if (score <= 2) return "bg-red-500";
        if (score <= 3) return "bg-yellow-500";
        if (score <= 4) return "bg-green-500";
        return "bg-green-600";
    };

    const strengthInfo = getStrengthLabel();
    const progressBarColor = getProgressBarColor();
    const progressWidth = `${(score / 5) * 100}%`;

    return (
        <div className="mt-3 mb-5">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password Strength</span>
                <span className={`text-xs font-medium ${strengthInfo.color}`}>
                    {strengthInfo.text}
                </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                <div
                    className={`h-1.5 rounded-full ${progressBarColor} transition-all duration-300`}
                    style={{ width: progressWidth }}
                ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                    {lengthValid ? (
                        <MdCheck className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <MdClose className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    <span className={lengthValid ? "text-green-600" : "text-gray-500"}>
                        At least 8 characters
                    </span>
                </div>

                <div className="flex items-center">
                    {uppercaseValid ? (
                        <MdCheck className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <MdClose className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    <span className={uppercaseValid ? "text-green-600" : "text-gray-500"}>
                        Uppercase letter
                    </span>
                </div>

                <div className="flex items-center">
                    {lowercaseValid ? (
                        <MdCheck className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <MdClose className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    <span className={lowercaseValid ? "text-green-600" : "text-gray-500"}>
                        Lowercase letter
                    </span>
                </div>

                <div className="flex items-center">
                    {numberValid ? (
                        <MdCheck className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <MdClose className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    <span className={numberValid ? "text-green-600" : "text-gray-500"}>
                        At least one number
                    </span>
                </div>

                <div className="flex items-center">
                    {specialValid ? (
                        <MdCheck className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <MdClose className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    <span className={specialValid ? "text-green-600" : "text-gray-500"}>
                        Special character
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PasswordStrengthChecker;
