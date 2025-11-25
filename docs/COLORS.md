# Palette de Couleurs ResellerPro

## 🎨 Couleurs Principales

### Sage Dark - `#157a6e`
- **HSL**: `163° 29% 40%`
- **Usage**: Couleur sombre, backgrounds, éléments forts
- **Tailwind**: `sage-dark`

### Emerald - `#2f8d6b` ⭐ Primaire
- **HSL**: `163° 50% 36%`
- **Usage**: Couleur primaire principale, boutons CTA, liens actifs
- **Tailwind**: `emerald` ou `primary`

### Mint - `#499f68`
- **HSL**: `151° 36% 46%`
- **Usage**: Couleur d'accent, éléments interactifs, badges
- **Tailwind**: `mint` ou `accent`

### Sage Light - `#77b28c`
- **HSL**: `138° 27% 59%`
- **Usage**: Couleur secondaire, états hover, éléments doux
- **Tailwind**: `sage-light` ou `secondary`

### Silver - `#c2c5bb`
- **HSL**: `75° 7% 75%`
- **Usage**: Backgrounds subtils, bordures, textes muted
- **Tailwind**: `silver` ou `muted`

---

## 🌓 Thèmes

### Thème Clair (Light Mode)
- **Background**: Blanc pur
- **Foreground**: Sage Dark dérivé
- **Primary**: Emerald (#2f8d6b)
- **Secondary**: Sage Light (#77b28c)
- **Accent**: Mint (#499f68)
- **Muted**: Silver (#c2c5bb)

### Thème Sombre (Dark Mode) ✅ **PAR DÉFAUT**
- **Background**: Sage Dark très sombre (HSL: 163° 29% 8%)
- **Foreground**: Silver clair (HSL: 75° 7% 90%)
- **Primary**: Emerald (#2f8d6b)
- **Secondary**: Sage Dark atténué
- **Accent**: Mint (#499f68)
- **Cards**: Background légèrement éclairci

---

## 📖 Utilisation

### Variables CSS
```css
--sage-dark: 163 29% 40%;      /* #157a6e */
--emerald: 163 50% 36%;        /* #2f8d6b */
--mint: 151 36% 46%;           /* #499f68 */
--sage-light: 138 27% 59%;     /* #77b28c */
--silver: 75 7% 75%;           /* #c2c5bb */
```

### Classes Tailwind
```jsx
// Couleurs directes
<div className="bg-emerald text-white">Bouton primaire</div>
<div className="bg-mint">Accent</div>
<div className="text-sage-dark">Texte sombre</div>

// Variables de thème (s'adaptent au thème)
<div className="bg-primary">S'adapte au thème</div>
<div className="text-foreground">Texte adaptatif</div>
<div className="border-border">Bordure adaptative</div>
```

### Gradients Recommandés
```jsx
// Hero sections
from-emerald to-mint
from-sage-dark via-emerald to-mint

// Backgrounds subtils
from-accent/20 to-background
from-primary/10 to-background

// CTA sections
from-sage-dark via-emerald to-mint
```

---

## 🎯 Hiérarchie Visuelle

1. **Actions principales**: `bg-primary` (Emerald)
2. **Actions secondaires**: `bg-secondary` (Sage Light) ou `variant="outline"`
3. **Éléments d'accent**: `bg-accent` (Mint)
4. **Backgrounds**: `bg-background` avec `border-border`
5. **Textes**:
   - Titres: `text-foreground`
   - Corps: `text-muted-foreground`
   - Liens: `text-primary hover:text-emerald`

---

## 🔄 Basculer le Thème

### Composant ThemeToggle
Utilisez `<ThemeToggle />` dans vos layouts pour permettre aux utilisateurs de basculer entre les thèmes.

```tsx
import { ThemeToggle } from '@/components/common/ThemeToggle';

<ThemeToggle />
```

### Configuration
- Le thème sombre est **activé par défaut** dans `app/layout.tsx`
- La préférence est sauvegardée dans `localStorage`
- Change la classe `dark` sur l'élément `<html>`

---

## ✅ État Actuel

- ✅ Palette de 5 couleurs intégrée
- ✅ Variables CSS configurées (globals.css)
- ✅ Variables Tailwind configurées (tailwind.config.js)
- ✅ Thème sombre activé par défaut
- ✅ Toggle de thème implémenté
- ✅ Landing page mise à jour avec les nouvelles couleurs
- ✅ Dashboard layout mis à jour avec les nouvelles couleurs

---

## 📝 Notes de Design

### Contraste et Accessibilité
- Tous les textes sur Emerald/Sage Dark utilisent du blanc pour un contraste optimal
- Silver fournit un bon contraste pour les textes sur fond sombre
- Mint est réservé aux accents et petits éléments

### Psychologie des Couleurs
- **Vert émeraude**: Croissance, argent, succès ✅
- **Vert menthe**: Fraîcheur, modernité, confiance
- **Vert sauge**: Calme, stabilité, professionnalisme
- **Argenté**: Élégance, modernité, neutralité

Parfait pour une application de **revente et e-commerce** ! 🚀
