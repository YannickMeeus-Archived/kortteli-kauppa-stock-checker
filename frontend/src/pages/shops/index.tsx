import { Loader } from "../../components/loader";
import { Page } from "../../components/page";
import { PageHeader } from "../../components/page-header";
import { Grid } from "@chakra-ui/react";
import {
  StatLabel,
  StatNumber,
  // StatHelpText,
  // StatArrow,
  // StatGroup,
} from "@chakra-ui/react";
import { InformationCard } from "../../components/information-card";
import { Shops, useGetShopsQuery } from "../../features/shops";

interface ShopStatsProps {
  name: string;
  identifier: string;
}

const ShopStats = ({ name }: ShopStatsProps) => {
  const getRandomUpto = (max: number) => Math.round(Math.random() * max);
  const randomCabinetCount = getRandomUpto(10);
  const randomProductCount = getRandomUpto(100);
  return (
    <InformationCard>
      <StatLabel>{name}</StatLabel>
      <StatNumber>{randomCabinetCount} Cabinets</StatNumber>
      <StatNumber>{randomProductCount} Products</StatNumber>
    </InformationCard>
  );
};

interface ShopListProps {
  shops: Shops;
}
const ShopList = ({ shops }: ShopListProps) => {
  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {shops.map((shop) => (
          <ShopStats key={shop.id} name={shop.name} identifier={shop.id} />
        ))}
      </Grid>
    </>
  );
};
export const ShopsPage = () => {
  const { data, isLoading } = useGetShopsQuery();
  return (
    <Page>
      <PageHeader>Shops</PageHeader>
      {isLoading ?? <Loader />}
      {!isLoading && data && <ShopList shops={data.data}></ShopList>}
    </Page>
  );
};
