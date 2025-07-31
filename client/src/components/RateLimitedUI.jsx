import { Zap } from "lucide-react";

const RateLimitedUI = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row items-center p-6">
                    <div className="flex-shrink-0 bg-blue-100 p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                        <Zap className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Rate Limit Reached</h3>
                        <p className="text-gray-700 mb-1">
                            You've made too many requests in a short period. Please wait a moment.
                        </p>
                        <p className="text-sm text-gray-500">
                            Try again in a few seconds for the best experience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RateLimitedUI;