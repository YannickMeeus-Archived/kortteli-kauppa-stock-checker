import { Page } from "../../components/page";
import { PageHeader } from "../../components/page-header";
import { ProductGrid } from "../../components/product-grid/product-grid";
import { ShopsSelection } from "../../components/shops-selection";

export const InventoryPage = () => {
  return (
    <Page>
      <PageHeader>Inventory</PageHeader>
      <ShopsSelection />
      <ProductGrid />
    </Page>
  );
};
