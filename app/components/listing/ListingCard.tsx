"use client";
import { useCallback, MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

import { SafeUser, SafeListing, SafeReservation } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";

import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId: string;
  currentUser?: SafeUser | null;
}

const ListingCard = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}: ListingCardProps) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation]);

  // Format reservation dates
  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="group col-span-1 cursor-pointer"
    >
      <div className="flex w-full flex-col gap-2">
        <div
          className="
            relative 
            aspect-square 
            w-full 
            overflow-hidden 
            rounded-xl
          "
        >
          <Image
            fill
            sizes="100%"
            src={data.imageSrc}
            alt={data.title}
            className="
              h-full
              w-full
              object-cover
              transition
              group-hover:scale-110
            "
          />

          <div className="absolute right-3 top-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>

        <div>
          <div className="text-lg font-semibold">
            {location?.region}, {location?.label}
          </div>

          <div className="font-light text-neutral-500">
            {reservationDate || data.category}
          </div>

          <div className="flex items-center">
            <div className="font-semibold">$ {price}</div>
            {!reservation && <div className="font-llight ml-1">night</div>}
          </div>
        </div>

        {onAction && actionLabel && (
          <Button
            small
            disabled={disabled}
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
