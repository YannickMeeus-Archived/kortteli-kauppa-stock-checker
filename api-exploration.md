# Kortteli Kauppa - Api Exploration

## Context

I know for a fact that there is at least one path available to retrieve literally
all products in a single store, but that's all the poking I've done so far.

So in this I will detail up some more of that poking, maybe find a way
to iterate through all the stores.

If not, then I'll just manually suck up that data and hold it statically in my
own little back-end.

## Data

### Get - Products by location

`http://188.166.11.123/Kortteliapp/api/cabin/list/v2/Kuninkaantammi`

That's basically it. Route discovery is disabled, but I did manage to sus out
that their back-end is running on RestEasy/JBoss.

The response format as described in TS interfaces:

```typescript
export interface Product {
  imageUrl: string; // CDN link to a graphic
  name: string; // Name in *Finnish*
}

export interface CabinetItem {
  amount: number; // How many items are currently held in this location
  barcode: string; // Internal Barcode
  epc: string; // Unique global identifier for this particular product
  location: string; // Which cabinet in the current location does this exist in
  product: Product; // Additional product details
}
```

The response is an array of the above.

### Static Data

#### Locations

I've collected this list by hand, maybe in the future I'll scrape them from
the actual [shop page](https://www.korttelikauppa.fi/kaupat).

- Kuninkaantammi
- Katajanokka
- Olari
- Painiitty
- Talinranta
- Keimolanmaki

I'll statically assign them with identifiers, or maybe normalise them down to
all lowercase, or something like that.
