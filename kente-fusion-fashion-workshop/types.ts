export interface DesignElement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Optional image for visual representation
}

export interface KenteColor {
  id: string; // Added to enable consistent identification
  name: string;
  hex: string;
  symbolism: string;
}

export interface DesignState {
  silhouette: DesignElement | null;
  kentePlacement: DesignElement | null;
  materialFusion: DesignElement | null;
  kenteColors: KenteColor[];
  accessories: DesignElement[];
  versatility: DesignElement | null;
}