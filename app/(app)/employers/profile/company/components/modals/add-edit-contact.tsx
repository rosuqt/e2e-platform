"use client";
import { useState, useEffect, forwardRef } from "react";
import { Dialog, DialogContent, Button, Box, Slide, TextField, Typography, } from "@mui/material";
import type { SlideProps } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Popper from "@mui/material/Popper";
import Image from "next/image";
import { countries } from "../../../../../../(landing)/sign-up/data/countries";
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaGithub, FaYoutube, FaGlobe,  } from "react-icons/fa6";
import { X } from "lucide-react";
import { SiIndeed } from "react-icons/si";
import Tooltip from "@mui/material/Tooltip";
import { RiContactsBook3Fill } from "react-icons/ri";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SOCIALS = [
  { key: "linkedin", label: "LinkedIn", icon: <FaLinkedin size={28} />, color: "bg-blue-100", text: "text-blue-600" },
  { key: "indeed", label: "Indeed", icon: <SiIndeed size={28} />, color: "bg-blue-900", text: "text-white" },
  { key: "facebook", label: "Facebook", icon: <FaFacebook size={28} />, color: "bg-blue-600", text: "text-white" },
  { key: "twitter", label: "Twitter", icon: <FaTwitter size={28} />, color: "bg-blue-400", text: "text-white" },
  { key: "instagram", label: "Instagram", icon: <FaInstagram size={28} />, color: "bg-pink-400", text: "text-white" },
  { key: "github", label: "GitHub", icon: <FaGithub size={28} />, color: "bg-gray-800", text: "text-white" },
  { key: "youtube", label: "YouTube", icon: <FaYoutube size={28} />, color: "bg-red-500", text: "text-white" },
{ key: "website", label: "Website", icon: <FaGlobe size={28} />, color: "bg-green-200", text: "text-green-700" }
];

type SocialLink = { key: string; url: string };

type AddEditContactModalProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: {
    email: string;
    countryCode: string;
    phone: string;
    website: string;
    address: string;
    socials: Record<string, string>;
  }) => void;
  initial?: {
    email?: string;
    countryCode?: string;
    phone?: string;
    website?: string;
    address?: string;
    socials?: Record<string, string>;
  };
};

export default function AddEditContactModal({
  open,
  onClose,
  onSave,
  initial
}: AddEditContactModalProps) {
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [errors, setErrors] = useState<{ email?: string; phone?: string; countryCode?: string; website?: string; address?: string; socials?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(initial?.email || "");
      setCountryCode(initial?.countryCode || "");
      setPhone(initial?.phone || "");
      setWebsite(initial?.website || "");
      setAddress(initial?.address || "");
      setSocials(
        initial?.socials
          ? Object.entries(initial.socials).map(([key, url]) => ({ key, url: url || "" }))
          : []
      );
      setErrors({});
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  const availableSocials = SOCIALS.filter(s => !socials.some(link => link.key === s.key));
  const mySocials = SOCIALS.filter(s => socials.some(link => link.key === s.key));

  const handleClose = () => {
    onClose?.();
    setErrors({});
    setSaving(false);
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email format";
    if (!countryCode) errs.countryCode = "Country code required";
    if (!phone) errs.phone = "Phone number required";
    else if (!/^\d{7,15}$/.test(phone)) errs.phone = "Invalid phone number";
    if (
      website &&
      !/^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/.*)?(\?.*)?$/.test(website.trim())
    ) {
      errs.website = "Enter a valid website (e.g. company.com or https://company.com/path)";
    }
    if (!address) errs.address = "Address required";
    if (socials.some(s => !s.url || !s.url.trim())) {
      errs.socials = "All selected socials must have a URL";
    } else if (
      socials.some(
        s =>
          !/^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/.*)?$/.test(s.url.trim())
      )
    ) {
      errs.socials = "Enter a valid link for each social (e.g. domain.com)";
    } else {
      const urls = socials.map(s => s.url.trim().toLowerCase()).filter(Boolean);
      const hasDuplicate = urls.length !== new Set(urls).size;
      if (hasDuplicate) {
        errs.socials = "Duplicate URLs for socials.";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    onSave?.({
      email,
      countryCode,
      phone,
      website,
      address,
      socials: socials.reduce((acc, s) => {
        acc[s.key] = s.url;
        return acc;
      }, {} as Record<string, string>)
    });
    handleClose();
  };

  const handleAddSocial = (key: string) => {
    setSocials([...socials, { key, url: "" }]);
  };

  const handleRemoveSocial = (key: string) => {
    setSocials(socials.filter(s => s.key !== key));
  };

  const handleSocialUrlChange = (key: string, url: string) => {
    setSocials(socials.map(s => s.key === key ? { ...s, url } : s));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          p: 0,
          minWidth: 600,
          maxWidth: 700,
          boxShadow: 8,
          background: "#fff",
          borderRadius: 3,
          overflow: "hidden"
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
            p: 4,
            color: "#fff",
            position: "relative"
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              minWidth: 0,
              width: 36,
              height: 36,
              borderRadius: "50%",
              color: "#fff",
              background: "rgba(30, 41, 59, 0.18)",
              zIndex: 2,
              "&:hover": { background: "rgba(30,41,59,0.28)" }
            }}
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                background: "rgba(255,255,255,0.18)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center"
              }}
            >
              <RiContactsBook3Fill className="w-6 h-6" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                Edit Company Contact Information
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Update your company contact details and social profiles
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Email <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <Tooltip
              title="You can't edit your email here. Please update your email in Settings if needed."
              placement="top"
              arrow
              enterDelay={1000}
            >
              <span>
                <TextField
                  fullWidth
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  variant="outlined"
                  placeholder="e.g. company@email.com"
                  sx={{
                    background: "#fff",
                    borderRadius: 2,
                    mb: 1,
                    fontSize: 15,
                    "& .MuiOutlinedInput-root": { fontSize: 15 }
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  inputProps={{ maxLength: 254, minLength: 6 }}
                />
              </span>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Country Code <span style={{ color: "#ef4444" }}>*</span>
              </Typography>
              <Autocomplete
                id="countryCode"
                options={countries}
                autoHighlight
                disablePortal
                PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
                getOptionLabel={(option) => `${option.code} (+${option.phone})`}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                      {...optionProps}
                    >
                      <Image
                        loading="lazy"
                        width={20}
                        height={15}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option.code} (+{option.phone})
                    </Box>
                  );
                }}
                value={countries.find((c) => c.phone === countryCode) || null}
                onChange={(event, newValue) => {
                  setCountryCode(newValue?.phone || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country Code"
                    error={!!errors.countryCode}
                    helperText={errors.countryCode}
                  />
                )}
                sx={{ minWidth: 120 }}
              />
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Phone Number <span style={{ color: "#ef4444" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                variant="outlined"
                placeholder="e.g. 9123456789"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 1,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
                error={!!errors.phone}
                helperText={errors.phone}
                inputProps={{ maxLength: 15, minLength: 7 }}
              />
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Headquarters Address <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={address}
              onChange={e => setAddress(e.target.value)}
              variant="outlined"
              placeholder="e.g. 123 Main St, City, Country"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 1,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              error={!!errors.address}
              helperText={errors.address}
              inputProps={{ maxLength: 120 }}
            />
          </Box>
          <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "24px 0" }} />
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 1, color: "#2563eb" }}>
              My Socials
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, position: "relative" }}>
              {mySocials.length === 0 ? (
                <Typography sx={{ fontSize: 14, color: "#64748b", mb: 2 }}>
                  Select a social below to add a social.
                </Typography>
              ) : (
                mySocials.map(s => {
                  const link = socials.find(l => l.key === s.key);
                  return (
                    <Box key={s.key} className={`flex flex-col items-center`} sx={{ minWidth: 90 }}>
                      <div className={`relative ${s.color} ${s.text} w-14 h-14 flex items-center justify-center rounded-full`}>
                        {s.icon}
                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(s.key)}
                          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white text-red-500 hover:text-red-700"
                          tabIndex={-1}
                          style={{ fontSize: 14, lineHeight: 1, border: "none" }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <TextField
                        size="small"
                        value={link?.url || ""}
                        onChange={e => handleSocialUrlChange(s.key, e.target.value)}
                        placeholder={`Enter link`}
                        sx={{ mt: 1, width: 110 }}
                        inputProps={{ maxLength: 100 }}
                      />
                      <Typography sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>{s.label}</Typography>
                    </Box>
                  );
                })
              )}
              {errors.socials && (
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: -32,
                    transform: "translateX(-50%)",
                    bgcolor: "#fff",
                    color: "#ef4444",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: 3,
                    fontSize: 13,
                    fontWeight: 500,
                    zIndex: 10,
                    minWidth: 220,
                    textAlign: "center"
                  }}
                >
                  {errors.socials}
                </Box>
              )}
            </Box>
          </Box>
          <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "24px 0" }} />
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 1, color: "#2563eb" }}>
              Add Socials
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {availableSocials.map(s => (
                <button
                  key={s.key}
                  type="button"
                  className={`flex flex-col items-center focus:outline-none`}
                  onClick={() => handleAddSocial(s.key)}
                  tabIndex={0}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <div className={`${s.color} ${s.text} w-14 h-14 flex items-center justify-center rounded-full`}>
                    {s.icon}
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{s.label}</span>
                </button>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                flex: 1,
                color: "#2563eb",
                borderColor: "#2563eb",
                fontWeight: 500,
                fontSize: 15,
                background: "#fff",
                "&:hover": { borderColor: "#1e40af", background: "#f1f5f9" }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              sx={{
                flex: 1,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                px: 3,
                boxShadow: "none",
                letterSpacing: 1,
                "&:hover": { background: "#1e40af" }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
