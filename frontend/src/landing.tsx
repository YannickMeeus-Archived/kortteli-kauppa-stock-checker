import {
  Box,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { Page } from "./components/page";
import { PageHeader } from "./components/page-header";
import { useGetVersionQuery } from "./features/infrastructure/version";

interface StatsCardProps {
  title: string;
  stat: string;
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props;
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <StatLabel fontWeight={"medium"} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {stat}
      </StatNumber>
    </Stat>
  );
}

function Landing() {
  const { data } = useGetVersionQuery();
  return (
    <Page>
      <PageHeader>What is this all about?</PageHeader>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        {data && <StatsCard title={"We run on version"} stat={data.data} />}
        <StatsCard title={"In"} stat={"1 singular country"} />
        <StatsCard title={"Who speak"} stat={"just 1 language"} />
      </SimpleGrid>
    </Page>
  );
}

export { Landing };
