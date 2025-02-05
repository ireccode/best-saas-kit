interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  priceId: string;
  popular?: boolean;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  priceId,
  popular = false,
}: PricingCardProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg ${
      popular ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="mb-4">
          {price === 'Custom' ? (
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
              {price !== '0' && (
                <span className="text-gray-600 dark:text-gray-300">/mo</span>
              )}
            </>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            popular
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
