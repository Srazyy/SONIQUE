declare module 'react-leaflet' {
  import { ComponentType, ReactNode, RefAttributes } from 'react';
  import * as L from 'leaflet';

  export interface MapContainerProps {
    center?: L.LatLngExpression;
    zoom?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }

  export interface MarkerProps {
    position: L.LatLngExpression;
    children?: ReactNode;
  }

  export interface PopupProps {
    children?: ReactNode;
  }

  export const MapContainer: ComponentType<MapContainerProps & RefAttributes<any>>;
  export const TileLayer: ComponentType<TileLayerProps & RefAttributes<any>>;
  export const Marker: ComponentType<MarkerProps & RefAttributes<any>>;
  export const Popup: ComponentType<PopupProps & RefAttributes<any>>;
  export function useMap(): L.Map;
}
