import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-all">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
          <div className="w-6 h-6 text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
