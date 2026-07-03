import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { RouterLink } from "@angular/router";
import { Hotspot, Room, rooms } from '../mock-data';

@Component({
  selector: 'app-tour',
  imports: [CommonModule, IconComponent, RouterLink],
  templateUrl: './tour.html',
  styleUrl: './tour.css'
})
export class TourComponent {

  activeRoomId = 'living';
  activeHotspot: Hotspot | null = null;
  rooms: Room[] = rooms;

  get currentRoom(): Room {
    return this.rooms.find(r => r.id === this.activeRoomId) || this.rooms[0];
  }

  selectRoom(roomId: string): void {
    this.activeRoomId = roomId;
    this.activeHotspot = null;
  }

  showHotspot(hotspot: Hotspot): void {
    this.activeHotspot = hotspot;
  }
}