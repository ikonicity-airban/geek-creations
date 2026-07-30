"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountAddressesPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Profile Form States
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Shipping Address Form States
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingProvince, setShippingProvince] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [shippingCountry, setShippingCountry] = useState("Nigeria");

  // Billing Matches Shipping Toggle
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true);

  // Billing Address Form States
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingProvince, setBillingProvince] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [billingCountry, setBillingCountry] = useState("Nigeria");

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
          const meta = user.user_metadata || {};

          // Populate states
          setDisplayName(meta.display_name || "");
          setPhoneNumber(meta.phone_number || "");

          // Populate shipping
          const ship = meta.shipping_address || {};
          setShippingAddress1(ship.address1 || "");
          setShippingCity(ship.city || "");
          setShippingProvince(ship.province || "");
          setShippingZip(ship.zip || "");
          setShippingCountry(ship.country || "Nigeria");

          // Populate billing toggle
          const billingMatches = meta.billing_matches_shipping !== false;
          setBillingMatchesShipping(billingMatches);

          // Populate billing
          const bill = meta.billing_address || {};
          setBillingAddress1(bill.address1 || "");
          setBillingCity(bill.city || "");
          setBillingProvince(bill.province || "");
          setBillingZip(bill.zip || "");
          setBillingCountry(bill.country || "Nigeria");
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const shipAddress = {
      address1: shippingAddress1,
      city: shippingCity,
      province: shippingProvince,
      zip: shippingZip,
      country: shippingCountry,
    };

    const billAddress = billingMatchesShipping
      ? shipAddress
      : {
          address1: billingAddress1,
          city: billingCity,
          province: billingProvince,
          zip: billingZip,
          country: billingCountry,
        };

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          phone_number: phoneNumber,
          shipping_address: shipAddress,
          billing_address: billAddress,
          billing_matches_shipping: billingMatchesShipping,
        },
      });

      if (error) throw error;
      setSuccessMsg("Profile and addresses updated successfully! 🎉");
      // Scroll to top to see notification
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setErrorMsg(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground text-sm">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-foreground">Profile & Addresses</h2>
        <p className="text-muted-foreground text-sm">
          Manage your personal details, primary phone contacts, and delivery addresses.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center gap-3 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Profile Card */}
        <div className="bg-card/45 backdrop-blur-md border border-border p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-3">
            <UserIcon className="w-5 h-5 text-primary" />
            Personal Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Account Email
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-55" />
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-muted pl-10 cursor-not-allowed text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Display Name
              </label>
              <Input
                type="text"
                placeholder="Chidi Okonkwo"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+234 803 123 4567"
                  className="pl-10"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-card/45 backdrop-blur-md border border-border p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-3">
            <MapPin className="w-5 h-5 text-primary" />
            Shipping Address
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Street Address
              </label>
              <Input
                type="text"
                placeholder="Plot 12, Adeola Hopewell Street"
                value={shippingAddress1}
                onChange={(e) => setShippingAddress1(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5 col-span-2 md:col-span-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  City
                </label>
                <Input
                  type="text"
                  placeholder="Victoria Island"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  State / Province
                </label>
                <Input
                  type="text"
                  placeholder="Lagos"
                  value={shippingProvince}
                  onChange={(e) => setShippingProvince(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Postal / ZIP
                </label>
                <Input
                  type="text"
                  placeholder="101241"
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Country
              </label>
              <Input
                type="text"
                placeholder="Nigeria"
                value={shippingCountry}
                onChange={(e) => setShippingCountry(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Billing Address Option */}
        <div className="bg-card/45 backdrop-blur-md border border-border p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-3 select-none">
            <input
              type="checkbox"
              id="billingMatchesShipping"
              checked={billingMatchesShipping}
              onChange={(e) => setBillingMatchesShipping(e.target.checked)}
              className="w-4.5 h-4.5 accent-primary cursor-pointer rounded-md"
            />
            <label
              htmlFor="billingMatchesShipping"
              className="font-bold text-sm text-foreground cursor-pointer"
            >
              Billing address matches shipping address
            </label>
          </div>

          {!billingMatchesShipping && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-4 border-t border-border/50 pt-4"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2">
                <MapPin className="w-5 h-5 text-primary" />
                Billing Address
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Street Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Plot 12, Adeola Hopewell Street"
                    value={billingAddress1}
                    onChange={(e) => setBillingAddress1(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5 col-span-2 md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      City
                    </label>
                    <Input
                      type="text"
                      placeholder="Victoria Island"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      State / Province
                    </label>
                    <Input
                      type="text"
                      placeholder="Lagos"
                      value={billingProvince}
                      onChange={(e) => setBillingProvince(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Postal / ZIP
                    </label>
                    <Input
                      type="text"
                      placeholder="101241"
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Country
                  </label>
                  <Input
                    type="text"
                    placeholder="Nigeria"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto font-bold px-8 py-3 flex items-center gap-2 hover:scale-103 active:scale-97 shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile & Addresses
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
