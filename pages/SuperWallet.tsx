import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowRightLeft, CreditCard, Globe, 
  Send, Plus, LogOut, Search, Bell, X, 
  Fingerprint, Scan, ArrowDown, History, 
  ChevronRight, Lock, ShieldCheck, Smartphone, 
  MoreHorizontal, RefreshCw, Server, Zap, Copy,
  Monitor, AlertTriangle, ChevronLeft, CheckCircle2,
  MapPin, Truck, Loader2, ShieldAlert, ScanEye,
  Activity, Cloud, HardDrive, ExternalLink, Code2, 
  ArrowUpRight, ArrowDownLeft, Landmark, Banknote, Phone,
  QrCode, ChevronDown, Repeat, Settings, User, Mail, 
  FileText, HelpCircle, Edit3, Camera, ToggleLeft, ToggleRight,
  Eye, EyeOff, Timer, KeyRound, Map, Palette, Trash2, Snowflake,
  Coffee, Car, Tv, ShoppingBag, ArrowDownCircle, Sparkles, Maximize2
} from 'lucide-react';

// --- Components ---

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46