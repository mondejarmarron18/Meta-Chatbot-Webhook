type TServices = {
  title: string;
  description: string;
  image: string;
  payload: string;
};

export enum ServicesPayload {
  'softwareDevelopment' = 'services_software_development',
  'websiteDevelopment' = 'services_website_development',
  'mobileAppDevelopment' = 'services_mobile_app_development',
  'digitalMarketing' = 'services_digital_marketing',
  'ventureBuilder' = 'services_venture_builder',
}

export const services: Array<TServices> = [
  {
    payload: ServicesPayload.softwareDevelopment,
    title: 'Software Development',
    description:
      'Build a customized software for business requirements or product. Whether you are looking at making a digital transformation in your company or want to develop a new tech product, you are in the right place. Automate, increase sales, make things more efficient – just tell us what your goal is. Our team of Software Engineers, UI/UX Designers and Project Managers will work closely with you from defining requirements, to developing systems in agile methods and ensuring the success of the project.',
    image:
      'https://lightweightsolutions.co/wp-content/uploads/2022/08/lightweight-solutions-software-development-service.png',
  },
  {
    payload: ServicesPayload.websiteDevelopment,
    title: 'Website Development',
    description:
      'Our certified web developers and designers are equipped with unparalleled expertise in working with the latest web technologies to deliver custom web solutions. Whether creating a web presence for your company, an information hub for your business or empowering your apps/IoT devices through backend – Lightweight Solutions does it all by covering a wide spectrum of web solutions and framework.',
    image:
      'https://lightweightsolutions.co/wp-content/uploads/2022/08/lightweight-solutions-website-development-service.png',
  },
  {
    payload: ServicesPayload.mobileAppDevelopment,
    title: 'Mobile App Development',
    description:
      'Create a platform that can be used by your team or consumers with smartphones. Provide a personalized user experience 24/7, resulting in better client and team engagement, efficiency and higher returns on investment. From B2B or B2E apps for enterprises, organizations, and startups, we have a proven track record of offering high-impact, result-driven, and engaging mobile application development services. Our company is renowned for delivering nativeAndroid app development, native iOS app development, hybrid and cross-platform app development services to build next-gen mobile applications using the latest technology stack.',
    image:
      'https://lightweightsolutions.co/wp-content/uploads/2022/08/lightweight-solutions-mobile-app-development-service.png',
  },
  {
    payload: ServicesPayload.digitalMarketing,
    title: 'Digital Marketing',
    description:
      'Go reach your business goals with our Digital Marketing services. Get assured leads and maximum ROI on your budget. We empower global enterprises and businesses to achieve their goals through creative content, personalized campaign creation with management, and 360- degree online brand management leveraging decades of experience. Our hawk-eyed Digital Marketing experts help businesses build relationships and re-engage with customers.',
    image:
      'https://lightweightsolutions.co/wp-content/uploads/2022/08/lightweight-solutions-digital-marketing-service.png',
  },
  {
    payload: ServicesPayload.ventureBuilder,
    title: 'Venture Builder',
    description:
      'Build your business ideas from ground up with the right team. Our team is constantly looking for partners who have a vision and drive for executing a smart business idea. From tech product development to marketing planning and execution, our team will help you bring your business to life.',
    image:
      'https://lightweightsolutions.co/wp-content/uploads/2022/08/lightweight-solutions-venture-builder-service.png',
  },
];
