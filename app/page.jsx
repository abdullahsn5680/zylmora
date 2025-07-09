export const revalidate = 3600;

import Banner from './Components/UI/Banner';
import CardContainer from './Components/UI/Container/CardContainer';

export default async function HomePage() {
  const content = await getData();

  return (
    <div className="md:px-[50px] px-1 w-full overflow-x-hidden">
      <div className="banner w-full">
        <Banner url={content.banner_Url} />
      </div>
      <div className="conatiners w-full">
        {content.Items.map((data) => (
          <CardContainer key={data.id} prop={data} />
        ))}
      </div>
    </div>
  );
}
